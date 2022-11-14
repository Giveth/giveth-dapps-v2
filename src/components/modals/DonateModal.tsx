import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	IconDonation,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { Modal } from '@/components/modals/Modal';
import { IProject } from '@/apollo/types/types';
import { compareAddresses, formatTxLink } from '@/lib/helpers';
import { mediaQueries, minDonationAmount } from '@/lib/constants/constants';
import { IMeGQL, IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';
import { createDonation } from '@/components/views/donate/helpers';
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

export interface IDonateModalProps extends IModal {
	project: IProject;
	token: IProjectAcceptedToken;
	amount: number;
	donationToGiveth: number;
	price?: number;
	anonymous?: boolean;
	setSuccessDonation: (i: ISuccessDonation) => void;
	givBackEligible?: boolean;
	projectWalletAddress: string;
	givethWalletAddress: string;
}

const DonateModal = (props: IDonateModalProps) => {
	const {
		project,
		token,
		amount,
		price,
		setShowModal,
		projectWalletAddress,
		givethWalletAddress,
		donationToGiveth,
		anonymous,
		setSuccessDonation,
		givBackEligible,
	} = props;

	const web3Context = useWeb3React();
	const { account, chainId } = web3Context;
	const dispatch = useAppDispatch();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const isDonatingToGiveth = donationToGiveth > 0;

	const { formatMessage } = useIntl();
	const [donating, setDonating] = useState(false);
	const [firstDonationSaved, setFirstDonationSaved] = useState(false);
	const [secondDonationSaved, setSecondDonationSaved] = useState(false);
	const [firstTxHash, setFirstTxHash] = useState('');
	const [secondTxHash, setSecondTxHash] = useState('');
	const [isFirstTxSuccess, setIsFirstTxSuccess] = useState(false);
	const [secondTxStatus, setSecondTxStatus] = useState<EToastType>();
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();

	const { title } = project || {};

	const avgPrice = price && price * amount;
	let donationToGivethAmount = (amount * donationToGiveth) / 100;
	if (donationToGivethAmount < minDonationAmount && isDonatingToGiveth) {
		donationToGivethAmount = minDonationAmount;
	}
	const donationToGivethPrice = price && donationToGivethAmount * price;

	const validateToken = async () => {
		setDonating(true);
		client
			.query({
				query: VALIDATE_TOKEN,
				fetchPolicy: 'no-cache',
			})
			.then((res: IMeGQL) => {
				const address = res.data?.me?.walletAddress;
				if (compareAddresses(address, account)) {
					handleDonate();
				} else {
					handleFailedValidation();
				}
			})
			.catch(handleFailedValidation);
	};

	const handleFailedValidation = () => {
		dispatch(signOut());
		dispatch(setShowSignWithWallet(true));
		closeModal();
	};

	const delayedCloseModal = (txHash1: string, txHash2?: string) => {
		const txHash = txHash2 ? [txHash1, txHash2] : [txHash1];
		setTimeout(() => {
			closeModal();
			setSuccessDonation({ txHash, givBackEligible });
		}, 4000);
	};

	const handleDonate = () => {
		const txProps = {
			anonymous,
			web3Context,
			setDonating,
			amount,
			token,
			setFailedModalType,
		};
		createDonation({
			...txProps,
			setTxHash: setFirstTxHash,
			setDonationSaved: setFirstDonationSaved,
			walletAddress: projectWalletAddress,
			projectId: Number(project.id),
		}).then(({ isSaved, txHash: firstHash }) => {
			setIsFirstTxSuccess(true);
			if (isDonatingToGiveth) {
				createDonation({
					...txProps,
					setTxHash: setSecondTxHash,
					setDonationSaved: setSecondDonationSaved,
					walletAddress: givethWalletAddress,
					amount: donationToGivethAmount,
					projectId: config.GIVETH_PROJECT_ID,
				})
					.then(({ txHash: secondHash }) => {
						setSecondTxStatus(EToastType.Success);
						isSaved && delayedCloseModal(firstHash, secondHash);
					})
					.catch(({ txHash: secondHash }) => {
						setSecondTxStatus(EToastType.Error);
						isSaved && delayedCloseModal(firstHash, secondHash);
					});
			} else if (isSaved) {
				delayedCloseModal(firstHash);
			}
		});
	};

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
							{isFirstTxSuccess
								? formatMessage({
										id: 'label.donation_submitted',
								  })
								: formatMessage({
										id: 'label.you_are_donating',
								  })}
						</Lead>
						<DonateSummary
							value={amount}
							tokenSymbol={token.symbol}
							usdValue={avgPrice}
							title={title}
						/>
						{isFirstTxSuccess && (
							<TxStatus>
								<InlineToast
									type={EToastType.Success}
									message={
										formatMessage({
											id: 'label.donation_to_the',
										}) +
										' ' +
										title +
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
											id: 'label.view_on_etherscan',
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
										: isFirstTxSuccess
										? formatMessage({
												id: 'label.you_are_donating',
										  })
										: formatMessage({
												id: 'label.and',
										  })}
								</Lead>
								<DonateSummary
									value={donationToGivethAmount}
									tokenSymbol={token.symbol}
									usdValue={donationToGivethPrice}
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
													id: 'label.view_on_etherscan',
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
						{firstDonationSaved && (
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
							disabled={donating}
							label={
								donating
									? formatMessage({ id: 'label.donating' })
									: formatMessage({ id: 'label.donate' })
							}
							onClick={validateToken}
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

const CloseButton = styled(Button)`
	margin: 5px 0 0 0;
	:hover {
		background: transparent;
	}
`;

export default DonateModal;
