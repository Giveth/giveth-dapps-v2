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
import config from '@/configuration';
import { IOnTxHash } from '@/services/donation';
import { DONATION_DESTINATION_ADDRESS } from './data';
import { ICardanoAcceptedToken } from './types';
import { getCoingeckoADAPrice } from './helpers';

interface IDonateModalProps extends IModal {
	token: IProjectAcceptedToken;
	amount: bigint;
	tokenPrice?: number;
	anonymous?: boolean;
	givBackEligible?: boolean;
}

const CardanoDonateModal: FC<IDonateModalProps> = props => {
	const { token, amount, setShowModal, anonymous, givBackEligible } = props;

	const { wallet } = useWallet();

	const [tokenPrice, setTokenPrice] = useState(0);

	const createDonationHook =
		token.chainType === ChainType.SOLANA
			? useCreateSolanaDonation
			: useCreateEvmDonation;
	const {
		txHash: firstTxHash,
		donationSaved: firstDonationSaved,
		donationMinted: firstDonationMinted,
	} = createDonationHook();
	const { walletAddress: address } = useGeneralWallet();

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

		console.log('donationAmount', donationAmount);

		try {
			const tokenUnit = cardanoToken.symbol || 'ADA';

			console.log('tokenUnit', cardanoToken);

			// Build transaction
			const tx = new Transaction({ initiator: wallet });

			if (tokenUnit === 'ADA') {
				console.log('ADA transfer');
				// ADA transfer: convert ADA → lovelace (1 ADA = 1,000,000 lovelace)
				tx.sendLovelace(
					projectWalletAddress,
					(BigInt(donationAmount) * 1_000_000n).toString(),
				);
			} else {
				// Token transfer
				tx.sendAssets(projectWalletAddress, [
					{
						unit: tokenUnit,
						quantity: String(donationAmount), // must be in token's smallest unit
					},
				]);
			}

			// Submit transaction
			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);

			console.log('Transaction submitted:', txHash);
			alert(`✅ Transaction submitted: ${txHash}`);

			// setFailedModalType(EDonationFailedType.REJECTED);

			// Save donation
			if (txHash) {
				const donationProps: IOnTxHash = {
					chainId: config.CAUSES_CONFIG.recipientToken.network,
					amount: donationAmount,
					token: {
						name: config.CAUSES_CONFIG.recipientToken.symbol,
						symbol: config.CAUSES_CONFIG.recipientToken.symbol,
						address: config.CAUSES_CONFIG.recipientToken.address,
						decimals: config.CAUSES_CONFIG.recipientToken.decimals,
						networkId: config.CAUSES_CONFIG.recipientToken.network,
						chainType: ChainType.EVM,
						order: 0,
					},
					projectId: Number(project.id),
					anonymous,
					useDonationBox: false,
					walletAddress: address || '',
					symbol: token.symbol,
					setFailedModalType,
					fromTokenAmount: parseFloat(projectDonation.toString()),
				};

				// await saveCauseDonation(donationProps);

				console.log('Transaction saved', txHash);

				// delayedCloseModal(txHash);
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
