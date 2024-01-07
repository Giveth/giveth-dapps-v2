import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	IconDonation,
	Lead,
	neutralColors,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { useAccount, useNetwork } from 'wagmi';
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
import config from '@/configuration';
import DonateSummary from '@/components/views/donate/DonateSummary';
import ExternalLink from '@/components/ExternalLink';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useDonateData } from '@/context/donate.context';
import { useCreateDonation } from '@/hooks/useCreateDonation';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { calcDonationShare } from '@/components/views/donate/helpers';

interface IDonateModalProps extends IModal {
	token: IProjectAcceptedToken;
	amount: number;
	donationToGiveth: number;
	tokenPrice?: number;
	anonymous?: boolean;
	givBackEligible?: boolean;
}

const DonateModal: FC<IDonateModalProps> = props => {
	const {
		token,
		amount,
		setShowModal,
		donationToGiveth,
		anonymous,
		givBackEligible,
	} = props;
	const {
		createDonation: createFirstDonation,
		txHash: firstTxHash,
		donationSaved: firstDonationSaved,
		donationMinted: firstDonationMinted,
	} = useCreateDonation();
	const {
		createDonation: createSecondDonation,
		txHash: secondTxHash,
		donationSaved: secondDonationSaved,
	} = useCreateDonation();
	const { address } = useAccount();
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const dispatch = useAppDispatch();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const isDonatingToGiveth = donationToGiveth > 0;
	const { formatMessage } = useIntl();
	const { setSuccessDonation, project } = useDonateData();

	const [donating, setDonating] = useState(false);
	const [secondTxStatus, setSecondTxStatus] = useState<EToastType>();
	const [processFinished, setProcessFinished] = useState(false);
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();

	const tokenPrice = useTokenPrice(token);

	const chainvineReferred = getWithExpiry(StorageLabel.CHAINVINEREFERRED);
	const { title, addresses, givethAddresses } = project || {};
	const projectWalletAddress = addresses?.find(
		a => a.isRecipient && a.networkId === chainId,
	)?.address;

	const givethWalletAddress = givethAddresses?.find(
		a => a.isRecipient && a.networkId === chainId,
	)?.address;

	const { projectDonation, givethDonation } = calcDonationShare(
		amount,
		donationToGiveth,
	);
	const projectDonationPrice = tokenPrice && tokenPrice * projectDonation;
	const givethDonationPrice = tokenPrice && givethDonation * tokenPrice;

	// this function is used to validate the token, if the token is valid, the user can donate, otherwise it will show an error message.
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
		const txHash = txHash2 ? [txHash1, txHash2] : [txHash1];
		setTimeout(() => {
			closeModal();
			setSuccessDonation({ txHash, givBackEligible });
		}, 4000);
	};

	const handleDonate = () => {
		const txProps = {
			anonymous,
			setDonating,
			token,
			setFailedModalType,
		};
		if (!projectWalletAddress || !givethWalletAddress) return;

		createFirstDonation({
			...txProps,
			amount: projectDonation,
			walletAddress: projectWalletAddress,
			projectId: Number(project.id),
			chainvineReferred,
			setFailedModalType,
			symbol: token.symbol,
		})
			.then(({ isSaved, txHash: firstHash }) => {
				console.log('FirstTxHash', firstHash);
				if (!firstHash) {
					setDonating(false);
					return;
				}

				if (isDonatingToGiveth) {
					createSecondDonation({
						...txProps,
						walletAddress: givethWalletAddress,
						amount: givethDonation,
						projectId: config.GIVETH_PROJECT_ID,
						setFailedModalType,
						symbol: token.symbol,
					})
						.then(({ txHash: secondHash }) => {
							if (!secondHash) {
								setSecondTxStatus(EToastType.Error);
								isSaved &&
									delayedCloseModal(firstHash, secondHash);
								return;
							}
							console.log('SecondDonation Success', secondHash);
							setSecondTxStatus(EToastType.Success);
							isSaved && delayedCloseModal(firstHash, secondHash);
						})
						.catch(({ txHash: secondHash }) => {
							console.log('SecondDonation Error', secondHash);
							setSecondTxStatus(EToastType.Error);
							isSaved && delayedCloseModal(firstHash, secondHash);
						});
				} else if (isSaved) {
					delayedCloseModal(firstHash);
				}
			})
			.catch(console.log);
	};

	if (!projectWalletAddress) {
		showToastError('There is no eth address assigned for this project');
		return null;
	}

	return (
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
										href={formatTxLink(
											chainId,
											firstTxHash,
										)}
										title={formatMessage({
											id: 'label.view_on_block_explorer',
										})}
										color={brandColors.pinky[500]}
									/>
								)}
							</TxStatus>
						)}
						{isDonatingToGiveth && (
							<>
								<Lead>
									{secondDonationSaved
										? formatMessage({
												id: 'label.donation_submitted',
											})
										: firstDonationSaved
											? formatMessage({
													id: 'label.you_are_donating',
												})
											: formatMessage({
													id: 'label.and',
												})}
								</Lead>
								<DonateSummary
									value={givethDonation}
									tokenSymbol={token.symbol}
									usdValue={givethDonationPrice}
									title='The Giveth DAO'
								/>
								{secondTxStatus && (
									<TxStatus>
										<InlineToast
											type={secondTxStatus}
											message={`
												${formatMessage({
													id: 'label.donation_to_the',
												})} Giveth DAO
													${
														secondTxStatus ===
														EToastType.Success
															? formatMessage({
																	id: 'label.successful',
																})
															: formatMessage({
																	id: 'label.failed_lowercase',
																})
													}
											`}
										/>
										{secondTxHash && (
											<ExternalLink
												href={formatTxLink(
													chainId,
													secondTxHash,
												)}
												title={formatMessage({
													id: 'label.view_on_block_explorer',
												})}
												color={brandColors.pinky[500]}
											/>
										)}
									</TxStatus>
								)}
							</>
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
							buttonType='primary'
							disabled={donating || processFinished}
							label={
								donating
									? formatMessage({ id: 'label.donating' })
									: formatMessage({ id: 'label.donate' })
							}
							onClick={validateTokenThenDonate}
						/>
					</Buttons>
				</DonateContainer>
			</Modal>
			{failedModalType && (
				<FailedDonation
					txUrl={formatTxLink(chainId, firstTxHash || secondTxHash)}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</>
	);
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
	:hover:enabled {
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

export default DonateModal;
