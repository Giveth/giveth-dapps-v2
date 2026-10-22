import styled from 'styled-components';
import {
	Button,
	IconDonation32,
	IconWalletApprove32,
	brandColors,
	P,
} from '@giveth/ui-design-system';
import { Address, isAddress } from 'viem';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import ClaimWithdrawalItem from './ClaimWithdrawalItem';
import { IProject } from '@/apollo/types/types';
import { ClaimWithdrawalStatus } from './ClaimWithdrawalStatus';
import { formatTxLink, showToastError } from '@/lib/helpers';
import { ChainType } from '@/types/config';
import { ClaimTransactionState } from './type';
import { ensureCorrectNetwork } from '@/helpers/network';
import {
	ClaimTransactionError,
	EClaimStep,
	executeAnchorClaim,
	isETHxToken,
} from '@/helpers/claimRecurringDonation';
import { isUserRejectedError } from '@/helpers/transactionErrors';
interface IClaimWithdrawalModal extends IModal {
	selectedStream: ITokenWithBalance;
	project: IProject;
	anchorContractAddress: Address;
	recurringNetworkId: number;
	balanceInUsd: number;
	refetch: () => Promise<void>;
}

const contents = {
	[ClaimTransactionState.NOT_STARTED]: {
		title: 'label.claim_recurring_donation',
		icon: <IconDonation32 />,
		buttonText: 'label.confirm',
	},
	[ClaimTransactionState.WITHDRAWING]: {
		title: 'label.claim_recurring_donation',
		icon: <IconWalletApprove32 />,
		buttonText: 'label.withdrawing',
	},
	[ClaimTransactionState.DOWNGRADING_TO_ETH]: {
		title: 'label.claim_recurring_donation',
		icon: <IconWalletApprove32 />,
		buttonText: 'label.downgrading_to_eth',
	},
	[ClaimTransactionState.TRANSFERRING_ETH]: {
		title: 'label.claim_recurring_donation',
		icon: <IconWalletApprove32 />,
		buttonText: 'label.sending_eth_to_project_op_address',
	},
	[ClaimTransactionState.SUCCESS]: {
		title: 'label.claim_successful',
		icon: <IconWalletApprove32 />,
		buttonText: 'label.done',
	},
};

const ClaimWithdrawalModal = ({
	setShowModal,
	selectedStream,
	project,
	anchorContractAddress,
	recurringNetworkId,
	balanceInUsd,
	refetch,
}: IClaimWithdrawalModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [transactionState, setTransactionState] =
		useState<ClaimTransactionState>(ClaimTransactionState.NOT_STARTED);
	const [txHash, setTxHash] = useState<Address>();
	const { formatMessage } = useIntl();

	const projectName = project.title || '';
	// The recipient must be the project's address on the same network as the
	// Anchor contract we are claiming from, never the wallet's current chain.
	const projectAddress =
		project.addresses?.find(
			address => address.networkId === recurringNetworkId,
		)?.address || '';

	const isETHx = isETHxToken(selectedStream.token);

	const getErrorMessage = (error: unknown) => {
		if (error instanceof ClaimTransactionError) {
			return formatMessage({
				id:
					error.step === EClaimStep.TRANSFER
						? 'label.claim_transfer_failed'
						: 'label.claim_downgrade_failed',
			});
		}
		return error instanceof Error && error.message
			? error.message
			: formatMessage({ id: 'label.claim_failed' });
	};

	const handleConfirm = async () => {
		try {
			const isOnCorrectNetwork =
				await ensureCorrectNetwork(recurringNetworkId);
			if (!isOnCorrectNetwork) {
				throw new Error(
					formatMessage({ id: 'label.claim_switch_network_failed' }),
				);
			}
			if (
				!projectAddress ||
				!isAddress(projectAddress, { strict: false })
			) {
				throw new Error(
					formatMessage({ id: 'label.claim_no_recipient_address' }),
				);
			}

			setTransactionState(
				isETHx
					? ClaimTransactionState.DOWNGRADING_TO_ETH
					: ClaimTransactionState.WITHDRAWING,
			);

			await executeAnchorClaim({
				chainId: recurringNetworkId,
				anchorContractAddress,
				projectAddress,
				token: selectedStream.token,
				amount: selectedStream.balance,
				onDowngradeSent: hash => setTxHash(hash),
				onTransferStarted: () =>
					setTransactionState(ClaimTransactionState.TRANSFERRING_ETH),
				onTransferSent: hash => setTxHash(hash),
			});

			setTransactionState(ClaimTransactionState.SUCCESS);
			await refetch();
		} catch (error) {
			console.error('Claim recurring donation error', {
				error,
				anchorContractAddress,
				recurringNetworkId,
			});
			setTransactionState(ClaimTransactionState.NOT_STARTED);
			if (!isUserRejectedError(error)) {
				showToastError(getErrorMessage(error));
			}
		}
	};

	const isLoading =
		transactionState === ClaimTransactionState.WITHDRAWING ||
		transactionState === ClaimTransactionState.DOWNGRADING_TO_ETH ||
		transactionState === ClaimTransactionState.TRANSFERRING_ETH;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: contents[transactionState].title,
			})}
			headerTitlePosition='left'
			headerIcon={contents[transactionState].icon}
			doNotCloseOnClickOutside={isLoading}
			hiddenClose={isLoading}
		>
			<ModalContainer>
				{isETHx && (
					<TransactionWarning>
						You&apos;ll need to sign two transactions to withdraw
						ETH to your recipient address.{' '}
						<b>
							DO NOT CLOSE THIS WINDOW UNTIL BOTH TRANSACTIONS
							FINISH.
						</b>
					</TransactionWarning>
				)}
				<ClaimWithdrawalItem
					projectName={projectName}
					stream={selectedStream}
					balanceInUsd={balanceInUsd}
				/>
				<br />
				<ClaimWithdrawalStatus status={transactionState} />
				{txHash && (
					<>
						<CustomLink
							href={formatTxLink({
								txHash,
								networkId: recurringNetworkId,
								chainType: ChainType.EVM,
							})}
							target='_blank'
						>
							{formatMessage({
								id: 'label.view_on_block_explorer',
							})}
						</CustomLink>
					</>
				)}
				<FullWidthButton
					label={formatMessage({
						id: contents[transactionState].buttonText,
					})}
					onClick={
						transactionState === ClaimTransactionState.SUCCESS
							? closeModal
							: handleConfirm
					}
					style={{ width: '100%' }}
					loading={isLoading}
					disabled={isLoading}
				/>
			</ModalContainer>
		</Modal>
	);
};

const FullWidthButton = styled(Button)`
	width: 100%;
`;

const ModalContainer = styled.div`
	max-width: 500px;
	padding: 24px;
`;

const CustomLink = styled.a`
	display: inline-block;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	padding-bottom: 16px;
`;

const TransactionWarning = styled(P)`
	text-align: left;
	padding-bottom: 16px;
`;

export default ClaimWithdrawalModal;
