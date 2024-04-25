import {
	semanticColors,
	IconAlertCircle16,
	Caption,
	IconCheckCircleFilled16,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { ClaimTransactionState } from './type';

interface IClaimWithdrawalStatusProps {
	status: ClaimTransactionState;
}

export const ClaimWithdrawalStatus = ({
	status,
}: IClaimWithdrawalStatusProps) => {
	const { formatMessage } = useIntl();

	const handleStatusText = () => {
		switch (status) {
			case ClaimTransactionState.SUCCESS:
				return formatMessage({
					id: 'label.your_withdrawal_from_this_stream_balance_was_successful',
				});
			case ClaimTransactionState.WITHDRAWING:
				return formatMessage({
					id: 'label.your_withdrawal_from_this_stream_balance_is_being_processed',
				});
			case ClaimTransactionState.DOWNGRADING_TO_ETH:
				return formatMessage({
					id: 'label.your_withdrawal_from_this_stream_balance_is_being_processed',
				});
			case ClaimTransactionState.TRANSFERRING_ETH:
				return formatMessage({
					id: 'label.your_withdrawal_from_this_stream_balance_is_being_processed',
				});
		}
	};

	if (status === ClaimTransactionState.NOT_STARTED) return;
	return (
		<Container $status={status}>
			<Flex gap='16px' $alignItems='center'>
				{status === ClaimTransactionState.SUCCESS ? (
					<IconCheckCircleFilled16 />
				) : (
					<IconAlertCircle16 />
				)}
				{handleStatusText()}
			</Flex>
		</Container>
	);
};

const Container = styled(Caption)<{ $status: ClaimTransactionState }>`
	display: flex;
	gap: 4px;
	align-items: center;
	text-transform: capitalize;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 16px;
	border: 1px solid
		${props => {
			switch (props.$status) {
				case ClaimTransactionState.SUCCESS:
					return semanticColors.jade[500];
				case ClaimTransactionState.WITHDRAWING:
				case ClaimTransactionState.DOWNGRADING_TO_ETH:
				case ClaimTransactionState.TRANSFERRING_ETH:
					return semanticColors.blueSky[400];
			}
		}};
	color: ${props => {
		switch (props.$status) {
			case ClaimTransactionState.SUCCESS:
				return semanticColors.jade[500];
			case ClaimTransactionState.WITHDRAWING:
			case ClaimTransactionState.DOWNGRADING_TO_ETH:
			case ClaimTransactionState.TRANSFERRING_ETH:
				return semanticColors.blueSky[500];
		}
	}};
	background: ${props => {
		switch (props.$status) {
			case ClaimTransactionState.SUCCESS:
				return semanticColors.jade[100];
			case ClaimTransactionState.WITHDRAWING:
			case ClaimTransactionState.DOWNGRADING_TO_ETH:
			case ClaimTransactionState.TRANSFERRING_ETH:
				return semanticColors.blueSky[100];
		}
	}};
`;
