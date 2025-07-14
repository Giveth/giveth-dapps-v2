import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	IconDonation,
	Lead,
	neutralColors,
	Button,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Chain } from 'viem';
import StorageLabel, { getWithExpiry } from '@/lib/localStorage';
import { Modal } from '@/components/modals/Modal';
import { compareAddresses, formatTxLink, showToastError } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { IMeGQL, IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { IModal } from '@/types/common';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { client } from '@/apollo/apolloClient';
import { VALIDATE_TOKEN } from '@/apollo/gql/gqlUser';
import { useAppDispatch } from '@/features/hooks';
import { signOut } from '@/features/user/user.thunks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import DonateSummary from '@/components/views/donate/DonateSummary';
import ExternalLink from '@/components/ExternalLink';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import {
	useCauseDonateData,
	TxHashWithChainType,
} from '@/context/donate.cause.context';
import { useCreateEvmDonation } from '@/hooks/useCreateEvmDonation';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { IWalletAddress } from '@/apollo/types/types';
import { useCreateSolanaDonation } from '@/hooks/useCreateSolanaDonation';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { calcDonationShare } from '@/components/views/donate/common/helpers';
import createGoogleTagEventPurchase from '@/helpers/googleAnalytics';
import SanctionModal from '@/components/modals/SanctionedModal';

interface IDonateModalProps extends IModal {
	token: IProjectAcceptedToken;
	amount: bigint;
	tokenPrice?: number;
	anonymous?: boolean;
	givBackEligible?: boolean;
}

const CauseDonateModal: FC<IDonateModalProps> = props => {
	const { token, amount, setShowModal, anonymous, givBackEligible } = props;
	const createDonationHook =
		token.chainType === ChainType.SOLANA
			? useCreateSolanaDonation
			: useCreateEvmDonation;
	const {
		createDonation: createFirstDonation,
		txHash: firstTxHash,
		donationSaved: firstDonationSaved,
		donationMinted: firstDonationMinted,
	} = createDonationHook();
	const {
		chain,
		walletChainType,
		walletAddress: address,
	} = useGeneralWallet();

	const chainId = (chain as Chain)?.id;
	const chainName = (chain as Chain)?.name;
	const dispatch = useAppDispatch();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const isDonatingToGiveth = false;
	const { formatMessage } = useIntl();
	const { setSuccessDonation, project, activeStartedRound } =
		useCauseDonateData();

	const [donating, setDonating] = useState(false);
	const [processFinished, setProcessFinished] = useState(false);
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const [isSanctioned, setIsSanctioned] = useState<boolean>(false);

	const categories = project?.categories || [];

	const tokenPrice = useTokenPrice(token);

	const isOnEligibleNetworks = activeStartedRound?.eligibleNetworks?.includes(
		(chain as Chain).id,
	);

	const includeInQF = activeStartedRound && isOnEligibleNetworks;
	const chainvineReferred = getWithExpiry(StorageLabel.CHAINVINEREFERRED);
	const { title, addresses } = project || {};

	const projectWalletAddress = findMatchingWalletAddress(
		addresses,
		chainId,
		walletChainType,
	);

	const { projectDonation } = calcDonationShare(amount, 0, token.decimals);

	const projectDonationPrice = tokenPrice && tokenPrice * projectDonation;

	// this function is used to validate the token and check if the wallet is sanctioned
	const validateTokenThenDonate = async () => {
		setDonating(true);
		client
			.query({
				query: VALIDATE_TOKEN,
				fetchPolicy: 'no-cache',
			})
			.then((res: IMeGQL) => {
				const _address = res.data?.me?.walletAddress;
				if (compareAddresses(_address, address)) {
					handleDonate();
				} else {
					handleFailedValidation();
				}
			})
			.catch(handleFailedValidation);
	};

	const handleFailedValidation = () => {
		dispatch(signOut(null));
		dispatch(setShowSignWithWallet(true));
		closeModal();
	};

	const delayedCloseModal = (txHash1: string, txHash2?: string) => {
		setProcessFinished(true);
		setDonating(false);

		const { chainType } = token;

		const txHashArray: TxHashWithChainType[] = [
			{ txHash: txHash1, chainType: chainType || ChainType.EVM },
			...(txHash2
				? [{ txHash: txHash2, chainType: chainType || ChainType.EVM }]
				: []),
		];

		setTimeout(() => {
			closeModal();
			setSuccessDonation({
				txHash: txHashArray,
				excludeFromQF: !includeInQF,
				givBackEligible,
				chainId,
			});
		}, 4000);
	};

	const handleDonate = () => {
		const txProps = {
			anonymous,
			setDonating,
			token,
			setFailedModalType,
		};
		if (!projectWalletAddress) {
			setDonating(false);
			return showToastError(
				"Project wallet address for the destination network doesn't exist",
			);
		}

		console.log('txProps', txProps);
	};

	const handleTxLink = (txHash?: string) => {
		return formatTxLink({
			txHash,
			networkId: chainId,
			chainType: token.chainType,
		});
	};

	return isSanctioned ? (
		<SanctionModal
			closeModal={() => {
				setIsSanctioned(false);
			}}
		/>
	) : (
		<>
			<Modal
				closeModal={closeModal}
				isAnimating={isAnimating}
				headerTitlePosition='left'
				headerIcon={<IconDonation size={32} />}
				doNotCloseOnClickOutside
				headerTitle={
					firstDonationSaved
						? formatMessage({ id: 'label.donation_submitted' })
						: formatMessage({ id: 'label.donating' })
				}
			>
				<DonateContainer>
					<DonatingBox>
						<Lead>
							{firstDonationMinted
								? formatMessage({
										id: 'label.donation_submitted',
									})
								: formatMessage({
										id: 'label.you_are_donating',
									})}
						</Lead>
						<DonateSummary
							value={projectDonation}
							tokenSymbol={token.symbol}
							usdValue={projectDonationPrice}
							title={title}
						/>
						{firstDonationMinted && (
							<TxStatus>
								<InlineToast
									type={EToastType.Success}
									message={
										formatMessage({
											id: 'label.donation_to_the',
										}) +
										' ' +
										title +
										' ' +
										formatMessage({
											id: 'label.successful',
										})
									}
								/>
								{firstTxHash && (
									<ExternalLink
										href={handleTxLink(firstTxHash)}
										title={formatMessage({
											id: 'label.view_on_block_explorer',
										})}
										color={brandColors.pinky[500]}
									/>
								)}
							</TxStatus>
						)}
					</DonatingBox>
					<Buttons>
						{firstDonationSaved && !processFinished && (
							<InlineToast
								type={EToastType.Info}
								message={formatMessage({
									id: 'label.your_donation_is_being_processed',
								})}
							/>
						)}
						<DonateButton
							loading={donating}
							buttonType='secondary'
							disabled={donating || processFinished}
							label={
								donating
									? formatMessage({
											id: 'label.donating',
										})
									: formatMessage({ id: 'label.donate' })
							}
							onClick={validateTokenThenDonate}
						/>
					</Buttons>
				</DonateContainer>
			</Modal>
			{failedModalType && (
				<FailedDonation
					txUrl={handleTxLink(firstTxHash)}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</>
	);
};

const Loading = styled(FlexCenter)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	height: 100%;
	width: 100%;
	background-color: gray;
	transition: opacity 0.3s ease-in-out;
	opacity: 0.9;
`;

const findMatchingWalletAddress = (
	addresses: IWalletAddress[] = [],
	chainId: number,
	chainType: ChainType | null,
) => {
	return addresses.find(a => {
		return (
			a.isRecipient &&
			((chainType !== ChainType.EVM && a.chainType === chainType) ||
				a.networkId === chainId)
		);
	})?.address;
};

const TxStatus = styled.div`
	margin-bottom: 12px;

	> div:first-child {
		margin-bottom: 12px;
	}
`;

const DonateContainer = styled.div`
	background: white;
	color: black;
	padding: 24px 24px 38px;
	margin: 0;
	width: 100%;

	${mediaQueries.tablet} {
		width: 494px;
	}
`;

const DonatingBox = styled.div`
	color: ${brandColors.deep[900]};

	> :first-child {
		margin-bottom: 8px;
	}

	h3 {
		margin-top: -5px;
	}

	h6 {
		color: ${neutralColors.gray[700]};
		margin-top: -5px;
	}

	> :last-child {
		margin: 12px 0 32px 0;

		> span {
			font-weight: 500;
		}
	}
`;

const DonateButton = styled(Button)<{ disabled: boolean }>`
	background: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};

	&:hover:enabled {
		background: ${brandColors.giv[700]};
	}

	:disabled {
		cursor: not-allowed;
	}

	> :first-child > div {
		border-top: 3px solid ${brandColors.giv[200]};
		animation-timing-function: linear;
	}

	text-transform: uppercase;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	> :first-child {
		margin: 15px 0;
	}
`;

export default CauseDonateModal;
