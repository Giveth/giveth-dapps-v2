import React, { FC, useEffect, useState } from 'react';
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
import { formatUnits } from 'viem';
import { Transaction } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';
import { Modal } from '@/components/modals/Modal';
import { formatTxLink, truncateToDecimalPlaces } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { IModal } from '@/types/common';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import DonateSummary from '@/components/views/donate/DonateSummary';
import ExternalLink from '@/components/ExternalLink';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useDonateData, TxHashWithChainType } from '@/context/donate.context';
import { useCreateEvmDonation } from '@/hooks/useCreateEvmDonation';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { IWalletAddress } from '@/apollo/types/types';
import { useCreateSolanaDonation } from '@/hooks/useCreateSolanaDonation';
import { calcDonationShare } from '@/components/views/donate/common/helpers';
import SanctionModal from '@/components/modals/SanctionedModal';
import { DONATION_DESTINATION_ADDRESS } from './data';
import { ICardanoAcceptedToken } from './types';
import {
	getCoingeckoADAPrice,
	ICardanoDonationProps,
	normalizeAmount,
	saveCardanoDonation,
} from './helpers';
import { useAppDispatch } from '@/features/hooks';
import { fetchUserByAddress } from '@/features/user/user.thunks';

interface IDonateModalProps extends IModal {
	token: IProjectAcceptedToken;
	amount: bigint;
	tokenPrice?: number;
	anonymous?: boolean;
	givBackEligible?: boolean;
}

const CardanoDonateModal: FC<IDonateModalProps> = props => {
	const { token, amount, setShowModal, givBackEligible } = props;

	const { wallet } = useWallet();

	const [tokenPrice, setTokenPrice] = useState(0);
	const [fromWalletAddress, setFromWalletAddress] = useState<string | null>(
		null,
	);
	const [userId, setUserId] = useState<number | null>(null);
	const dispatch = useAppDispatch();

	const createDonationHook =
		token.chainType === ChainType.SOLANA
			? useCreateSolanaDonation
			: useCreateEvmDonation;
	const {
		txHash: firstTxHash,
		donationSaved: firstDonationSaved,
		donationMinted: firstDonationMinted,
	} = createDonationHook();
	const { walletAddress: userWalletAddress } = useGeneralWallet();

	// Get user data by wallet address
	useEffect(() => {
		const getUserData = async () => {
			if (userWalletAddress) {
				const result = await dispatch(
					fetchUserByAddress(userWalletAddress),
				);
				if (result.payload?.data?.userByAddress?.id) {
					setUserId(result.payload.data.userByAddress.id);
				}
			}
		};
		getUserData();
	}, [userWalletAddress, dispatch]);

	const cardanoToken = token as ICardanoAcceptedToken;

	// Fetch token ADA price from coingecko
	useEffect(() => {
		const fetchTokenPrice = async () => {
			const price = await getCoingeckoADAPrice();
			setTokenPrice(price);
		};
		fetchTokenPrice();
	}, []);

	const chainId = 1;
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { setSuccessDonation, project } = useDonateData();

	const [donating, setDonating] = useState(false);
	const [processFinished, setProcessFinished] = useState(false);
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const [isSanctioned, setIsSanctioned] = useState<boolean>(false);

	const { title } = project || {};

	const projectWalletAddress = DONATION_DESTINATION_ADDRESS;

	const { projectDonation } = calcDonationShare(amount, 0, token.decimals);

	const projectDonationPrice =
		tokenPrice &&
		truncateToDecimalPlaces(
			String(
				Number(cardanoToken.cardano?.priceAda || 0) *
					Number(tokenPrice) *
					Number(formatUnits(amount, cardanoToken.decimals)),
			),
			2,
		);

	// Set up user cardano wallet address
	useEffect(() => {
		const getWalletAddress = async () => {
			const addr = await wallet.getChangeAddress();
			setFromWalletAddress(addr);
		};
		getWalletAddress();
	}, [wallet]);

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
				excludeFromQF: true,
				givBackEligible,
				chainId,
			});
		}, 4000);
	};

	const handleDonate = async () => {
		setDonating(true);

		let donationAmount = projectDonation;

		console.log({ cardanoToken });
		console.log({ donationAmount });

		try {
			const tokenUnit = cardanoToken.symbol || 'ADA';

			// Build transaction
			const tx = new Transaction({ initiator: wallet });

			const normalizedValue = normalizeAmount(String(donationAmount));

			if (tokenUnit === 'ADA') {
				tx.sendLovelace(
					projectWalletAddress,
					String(BigInt(Number(normalizedValue) * 1_000_000)),
				);
			} else {
				// Token transfer
				tx.sendAssets(projectWalletAddress, [
					{
						unit: cardanoToken.cardano?.unit || '',
						quantity: String(
							BigInt(Number(normalizedValue) * 1_000_000),
						),
					},
				]);
			}

			// Submit transaction
			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);

			console.log('Transaction submitted:', txHash);
			// setFailedModalType(EDonationFailedType.REJECTED);

			const cardanoNetworkId = await wallet.getNetworkId();
			console.log({ cardanoNetworkId }); // 1 = Mainnet, 0 = Testnet (preprod, preview)

			// Save donation
			if (txHash) {
				const tokenSymbol = cardanoToken.symbol || '';
				const donationProps: ICardanoDonationProps = {
					projectId: Number(project.id),
					transactionNetworkId: cardanoNetworkId === 1 ? 3000 : 3001,
					amount: donationAmount,
					transactionId: txHash,
					fromWalletAddress: fromWalletAddress || '',
					toWalletAddress: projectWalletAddress,
					tokenAddress: cardanoToken.cardano?.tokenAddress || '',
					anonymous: false,
					token: tokenSymbol,
					priceUsd: tokenPrice,
					valueUsd: projectDonationPrice,
					userId: userId || 0,
				};

				await saveCardanoDonation(donationProps);

				console.log('Cardano transaction saved', txHash);

				delayedCloseModal(txHash);
			} else {
				setFailedModalType(EDonationFailedType.FAILED);
				return;
			}
		} catch (error) {
			setFailedModalType(EDonationFailedType.REJECTED);
			console.error('Error making donation:', error);
		} finally {
			setDonating(false);
		}
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
							onClick={handleDonate}
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

export default CardanoDonateModal;
