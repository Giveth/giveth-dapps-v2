import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	IconDonation,
	Lead,
	neutralColors,
	Button,
	P,
	H3,
	IconCopy,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import config from '@/configuration';
import { mediaQueries } from '@/lib/constants/constants';
import { gToast, ToastType } from '@/components/toasts';
import DangerIcon from '/public/images/icons/danger_triangle.svg';

interface ILaunchCauseModalProps extends IModal {
	isLaunching: boolean;
	lunchStatus:
		| 'approval'
		| 'approval_success'
		| 'approval_failed'
		| 'transfer_success'
		| 'transfer_failed'
		| null;
	transactionStatus?: 'pending' | 'success' | 'failed';
	transactionHash?: string;
	transactionError?: string;
	handleApproval?: () => void;
	handleTransfer?: () => void;
	handleLaunchComplete?: () => void;
	isSubmitting?: boolean;
}

const LaunchCauseModal: FC<ILaunchCauseModalProps> = ({
	setShowModal,
	isLaunching,
	lunchStatus,
	transactionStatus,
	transactionHash,
	transactionError,
	handleApproval,
	handleTransfer,
	handleLaunchComplete,
	isSubmitting = false,
}) => {
	const { chain } = useAccount();
	const currentNetworkId = chain?.id;

	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { getValues } = useFormContext();

	// Check if current network supports cause creation
	const supportedNetwork = config.CAUSES_CONFIG.launchNetworks.find(
		network => network.network === currentNetworkId,
	);

	// Get launch token for current network
	const launchToken = supportedNetwork?.token || '';

	// Get token price using CoinGecko
	const launchTokenPrice = useTokenPrice({
		symbol: launchToken,
		coingeckoId: supportedNetwork?.coingeckoId,
	});

	// Get values from form
	const title = getValues('title');
	const launchFee = config.CAUSES_CONFIG.launchFee;

	// Calculate USD value of launch fee
	const launchFeeUSD = launchTokenPrice
		? (launchTokenPrice * launchFee).toFixed(2)
		: '0.00';

	// Handle copy transaction hash
	const handleCopyTransactionHash = () => {
		if (transactionHash) {
			navigator.clipboard.writeText(transactionHash);
			gToast(formatMessage({ id: 'label.copied' }), {
				type: ToastType.SUCCESS,
			});
		}
	};

	// Handle launch flow
	const handleLaunch = () => {
		// First try to approve the token
		if (lunchStatus === 'approval' || lunchStatus === 'approval_failed') {
			handleApproval?.();
		}

		// Then try to transfer the token
		if (
			lunchStatus === 'approval_success' ||
			lunchStatus === 'transfer_failed'
		) {
			handleTransfer?.();
		}

		// Finally try to launch the cause
		if (
			lunchStatus === 'transfer_success' &&
			transactionHash &&
			transactionStatus === 'success'
		) {
			handleLaunchComplete?.();
		}
	};

	const buttonText = () => {
		if (isSubmitting) {
			return formatMessage({ id: 'label.cause.launching' });
		}
		if (
			lunchStatus === 'transfer_failed' &&
			transactionStatus === 'failed'
		) {
			return formatMessage({ id: 'label.cause.transfer' });
		}
		if (lunchStatus === 'approval_success') {
			return formatMessage({ id: 'label.cause.transfer' });
		}
		if (
			lunchStatus === 'transfer_success' ||
			transactionStatus === 'success'
		) {
			return formatMessage({ id: 'label.cause.launch_complete' });
		}

		return formatMessage({ id: 'label.approve' });
	};

	const getHeaderTitle = () => {
		if (isSubmitting) {
			return formatMessage({ id: 'label.cause.launching_cause' });
		}
		if (
			lunchStatus === 'approval_failed' ||
			lunchStatus === 'transfer_failed'
		) {
			return formatMessage({ id: 'label.cause.launch_failed' });
		}
		if (
			lunchStatus === 'transfer_success' ||
			transactionStatus === 'success'
		) {
			return formatMessage({ id: 'label.cause.launch_complete' });
		}
		if (lunchStatus === 'approval_success') {
			return formatMessage({ id: 'label.cause.transfer' });
		}
		return formatMessage({ id: 'label.approve' });
	};

	const getLeadText = () => {
		if (isSubmitting) {
			return formatMessage({ id: 'label.cause.launching_cause' });
		}
		if (
			lunchStatus === 'approval_failed' ||
			lunchStatus === 'transfer_failed' ||
			transactionStatus === 'failed'
		) {
			return formatMessage({ id: 'label.cause.launch_failed_desc' });
		}
		if (
			lunchStatus === 'transfer_success' ||
			transactionStatus === 'success'
		) {
			return formatMessage({ id: 'label.cause.launch_successful' });
		}
		return formatMessage({ id: 'label.cause.you_are_launching' });
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerIcon={
				transactionError ? (
					<Image src={DangerIcon} alt='danger' />
				) : (
					<IconDonation size={32} />
				)
			}
			doNotCloseOnClickOutside={
				isLaunching || transactionStatus === 'pending'
			}
			headerTitle={getHeaderTitle()}
			headerColor={
				transactionError ? semanticColors.punch[500] : undefined
			}
		>
			<LaunchContainer>
				<LaunchingBox>
					{!transactionError && <Lead>{getLeadText()}</Lead>}
					{!transactionError && (
						<LaunchSummary>
							<TokenAmount>
								{formatDonation(launchFee, '')} {launchToken}
							</TokenAmount>
							<UsdAmount>
								<span>≈ ${launchFeeUSD} USD</span>
							</UsdAmount>
							<CauseTitle>
								to launch &quot;{title}&quot;
							</CauseTitle>
						</LaunchSummary>
					)}
					{transactionStatus === 'failed' && transactionError && (
						<ErrorMessage>
							<p>
								{formatMessage({
									id: 'label.cause.transaction_failed_desc',
								})}
								<br />
								{formatMessage({
									id: 'label.cause.transaction_failed_desc_2',
								})}
							</p>
						</ErrorMessage>
					)}
					{(lunchStatus === 'transfer_success' ||
						transactionStatus === 'success') && (
						<SuccessMessage>
							<P>
								{formatMessage({
									id: 'label.cause.transaction_success',
								})}
							</P>
							{transactionHash && (
								<TransactionHash>
									<P>
										{formatMessage({
											id: 'label.cause.transaction_hash',
										})}
										: {transactionHash.slice(0, 10)}...
										{transactionHash.slice(-8)}
									</P>
									<CopyIcon
										onClick={handleCopyTransactionHash}
									>
										<IconCopy size={16} />
									</CopyIcon>
								</TransactionHash>
							)}
						</SuccessMessage>
					)}
				</LaunchingBox>
				{!transactionError && (
					<Buttons>
						{isLaunching && (
							<InfoMessage>
								<P>
									{formatMessage({
										id: 'label.cause.launch_processing',
									})}
								</P>
							</InfoMessage>
						)}
						<LaunchButton
							loading={isLaunching || isSubmitting}
							buttonType={
								lunchStatus || transactionStatus === 'success'
									? 'primary'
									: 'secondary'
							}
							disabled={isSubmitting}
							label={buttonText()}
							onClick={handleLaunch}
						/>
					</Buttons>
				)}
			</LaunchContainer>
		</Modal>
	);
};

export default LaunchCauseModal;

const LaunchContainer = styled.div`
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 32px;
	text-align: center;
	min-width: 400px;
	${mediaQueries.tablet} {
		min-width: 500px;
	}
`;

const LaunchingBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const LaunchSummary = styled.div`
	padding: 24px;
	border-radius: 16px;
	background-color: ${neutralColors.gray[100]};
	border: 2px solid ${brandColors.giv[200]};
`;

const TokenAmount = styled(H3)`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: 700;
	font-size: 32px;
	line-height: 38px;
	letter-spacing: -0.005em;
	color: ${brandColors.deep[600]};
	margin-bottom: 8px;
`;

const UsdAmount = styled(P)`
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};
	margin-bottom: 16px;

	span {
		display: inline-block;
		padding: 4px 8px;
		border-radius: 8px;
		background: ${neutralColors.gray[200]};
		color: ${neutralColors.gray[900]};
		font-weight: 500;
	}
`;

const CauseTitle = styled(P)`
	font-weight: 500;
	font-size: 18px;
	line-height: 150%;
	color: ${brandColors.deep[600]};
`;

const SuccessMessage = styled.div`
	padding: 16px;
	border-radius: 8px;
	background-color: ${brandColors.giv[200]};
	border: 1px solid ${brandColors.giv[300]};
`;

const InfoMessage = styled.div`
	padding: 12px;
	border-radius: 8px;
	background-color: ${brandColors.cyan[200]};
	border: 1px solid ${brandColors.cyan[300]};
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	cursor: pointer;
`;

const LaunchButton = styled(Button)`
	padding: 16px 32px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
`;

const ErrorMessage = styled.div`
	border-radius: 16px;
	background: ${semanticColors.punch[100]};
	padding: 30px 20px;
	color: ${semanticColors.punch[700]};
	border: 1px solid ${semanticColors.punch[700]};
	margin-top: 42px;
	margin-bottom: 48px;
	font-size: 18px;
	font-weight: 400;
	line-height: 150%;
	p {
		margin: 0 0 5px;
	}

	${mediaQueries.mobileL} {
		padding: 24px;
	}
`;

const TransactionHash = styled.div`
	margin-top: 12px;
	padding: 8px;
	border-radius: 4px;
	background-color: ${neutralColors.gray[200]};
	font-family: monospace;
	font-size: 12px;
	color: ${neutralColors.gray[700]};
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`;

const CopyIcon = styled.div`
	cursor: pointer;
	color: ${brandColors.cyan[500]};
	display: flex;
	align-items: center;
	padding: 2px;
	border-radius: 4px;
	transition: all 0.2s ease;

	&:hover {
		color: ${brandColors.cyan[300]};
		background-color: ${neutralColors.gray[300]};
	}

	&:active {
		transform: scale(0.95);
	}
`;
