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
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { useNetworkId } from '@/hooks/useNetworkId';
import { IModal } from '@/types/common';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import config from '@/configuration';
import { mediaQueries } from '@/lib/constants/constants';

interface ILaunchCauseModalProps extends IModal {
	onLaunch: () => void;
	isLaunching: boolean;
	launched: boolean;
	transactionStatus?: 'pending' | 'success' | 'failed';
	transactionHash?: string;
	transactionError?: string;
	isApprovalPending?: boolean;
	handleLaunchComplete?: () => void;
}

const LaunchCauseModal: FC<ILaunchCauseModalProps> = ({
	setShowModal,
	onLaunch,
	isLaunching,
	launched,
	transactionStatus,
	transactionHash,
	transactionError,
	isApprovalPending,
	handleLaunchComplete,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { getValues } = useFormContext();

	// Get token price using CoinGecko
	const givTokenPrice = useTokenPrice({
		symbol: 'GIV',
		coingeckoId: 'giveth',
	});

	// Get values from form
	const title = getValues('title');
	const launchFee = config.CAUSES_CONFIG.launchFee;
	const currentNetworkId = useNetworkId();
	const launchToken = config.CAUSES_CONFIG.launchNetworks.find(
		network => network.network === currentNetworkId,
	)?.token;

	// Calculate USD value of launch fee
	const launchFeeUSD = givTokenPrice
		? (givTokenPrice * launchFee).toFixed(2)
		: '0.00';

	const handleLaunch = () => {
		console.log('handleLaunch', transactionStatus);
		if (transactionStatus === 'success') {
			closeModal();
			handleLaunchComplete?.();
		} else if (!isLaunching && !launched) {
			console.log('opet launh');
			onLaunch();
		}
	};

	const buttonText = () => {
		if (transactionStatus === 'failed') {
			return formatMessage({ id: 'label.cause.try_again' });
		}
		if (launched || transactionStatus === 'success') {
			return formatMessage({ id: 'label.cause.launch_complete' });
		}
		if (isLaunching || transactionStatus === 'pending') {
			if (isApprovalPending) {
				return formatMessage({ id: 'label.cause.confirming' });
			}
			return formatMessage({ id: 'label.cause.launching' });
		}
		return formatMessage({ id: 'label.cause.launch_cause' });
	};

	const getHeaderTitle = () => {
		if (transactionStatus === 'failed') {
			return formatMessage({ id: 'label.cause.launch_failed' });
		}
		if (launched || transactionStatus === 'success') {
			return formatMessage({ id: 'label.cause.launch_successful' });
		}
		return formatMessage({ id: 'label.cause.launching_cause' });
	};

	const getLeadText = () => {
		if (transactionStatus === 'failed') {
			return formatMessage({ id: 'label.cause.launch_failed_desc' });
		}
		if (launched || transactionStatus === 'success') {
			return formatMessage({ id: 'label.cause.launch_successful' });
		}
		return formatMessage({ id: 'label.cause.you_are_launching' });
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerIcon={<IconDonation size={32} />}
			doNotCloseOnClickOutside={
				isLaunching || transactionStatus === 'pending'
			}
			headerTitle={getHeaderTitle()}
		>
			<LaunchContainer>
				<LaunchingBox>
					<Lead>{getLeadText()}</Lead>
					<LaunchSummary>
						<TokenAmount>
							{formatDonation(launchFee, '')} {launchToken}
						</TokenAmount>
						<UsdAmount>
							<span>≈ ${launchFeeUSD} USD</span>
						</UsdAmount>
						<CauseTitle>to launch "{title}"</CauseTitle>
					</LaunchSummary>
					{transactionStatus === 'failed' && transactionError && (
						<ErrorMessage>
							<P>
								{formatMessage({
									id: 'label.cause.transaction_failed',
								})}
							</P>
							<ErrorDetail>{transactionError}</ErrorDetail>
						</ErrorMessage>
					)}
					{(launched || transactionStatus === 'success') && (
						<SuccessMessage>
							<P>
								{formatMessage({
									id: 'label.cause.launch_success_message',
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
								</TransactionHash>
							)}
						</SuccessMessage>
					)}
				</LaunchingBox>
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
						loading={isLaunching || transactionStatus === 'pending'}
						buttonType={
							launched || transactionStatus === 'success'
								? 'primary'
								: 'secondary'
						}
						disabled={
							isLaunching ||
							transactionStatus === 'pending' ||
							(launched && transactionStatus !== 'failed')
						}
						label={buttonText()}
						onClick={handleLaunch}
					/>
				</Buttons>
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
	padding: 16px;
	border-radius: 8px;
	background-color: ${brandColors.pinky[200]};
	border: 1px solid ${brandColors.pinky[400]};
`;

const ErrorDetail = styled.div`
	margin-top: 8px;
	font-size: 12px;
	color: ${brandColors.pinky[600]};
	font-family: monospace;
	word-break: break-all;
`;

const TransactionHash = styled.div`
	margin-top: 12px;
	padding: 8px;
	border-radius: 4px;
	background-color: ${neutralColors.gray[200]};
	font-family: monospace;
	font-size: 12px;
	color: ${neutralColors.gray[700]};
`;
