import styled from 'styled-components';
import {
	Button,
	IconDonation32,
	IconWalletApprove32,
	brandColors,
} from '@giveth/ui-design-system';
import { Address, encodeFunctionData } from 'viem';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useState } from 'react';
import { waitForTransaction } from '@wagmi/core';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import ClaimWithdrawalItem from './ClaimWithdrawalItem';
import { IProject } from '@/apollo/types/types';
import config from '@/configuration';
import superTokenABI from '@/artifacts/superToken.json';
import anchorContractABI from '@/artifacts/anchorContract.json';
import { ClaimTransactionState } from './ClaimRecurringDonationModal';
import { ClaimWithdrawalStatus } from './ClaimWithdrawalStatus';
import { formatTxLink } from '@/lib/helpers';
import { ChainType } from '@/types/config';

interface IClaimWithdrawalModal extends IModal {
	selectedStream: ITokenWithBalance;
	project: IProject;
	anchorContractAddress: Address;
	transactionState: ClaimTransactionState;
	setTransactionState: (state: ClaimTransactionState) => void;
	balanceInUsd: number;
}

const ClaimWithdrawalModal = ({
	setShowModal,
	selectedStream,
	project,
	anchorContractAddress,
	transactionState,
	setTransactionState,
	balanceInUsd,
}: IClaimWithdrawalModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [txHash, setTxHash] = useState<Address>();
	const { formatMessage } = useIntl();

	const projectName = project.title || '';
	const optimismAddress = project.addresses?.find(
		address => address.networkId === config.OPTIMISM_NETWORK_NUMBER,
	)?.address;

	const [loading, setLoading] = useState(false);

	const encodedDowngradeTo = encodeFunctionData({
		abi: superTokenABI.abi,
		functionName: 'downgradeTo',
		args: [optimismAddress, +selectedStream.balance.toString()],
	});

	const { config: executeConfig } = usePrepareContractWrite({
		abi: anchorContractABI.abi,
		address: anchorContractAddress,
		functionName: 'execute',
		chainId: config.OPTIMISM_NETWORK_NUMBER,
		args: [selectedStream.token.id, '', encodedDowngradeTo],
	});

	const executeContractWrite = useContractWrite(executeConfig);

	const handleConfirm = async () => {
		try {
			setLoading(true);
			setTransactionState(ClaimTransactionState.PENDING);
			const tx = await executeContractWrite.writeAsync?.();
			if (tx?.hash) {
				setTxHash(tx.hash);
				waitForTransaction({
					hash: tx.hash,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
				});
				setTransactionState(ClaimTransactionState.SUCCESS);
			}
		} catch (error) {
			setTransactionState(ClaimTransactionState.NOT_STARTED);
		} finally {
			setLoading(false);
		}
	};

	const handleStates = () => {
		switch (transactionState) {
			case ClaimTransactionState.NOT_STARTED:
				return {
					title: formatMessage({
						id: 'label.claim_recurring_donaiton',
					}),
					icon: <IconDonation32 />,
					buttonText: formatMessage({
						id: 'label.confirm',
					}),
				};
			case ClaimTransactionState.PENDING:
				return {
					title: formatMessage({
						id: 'label.claim_recurring_donaiton',
					}),
					icon: <IconWalletApprove32 />,
					buttonText: formatMessage({
						id: 'label.withdrawing',
					}),
				};

			case ClaimTransactionState.SUCCESS:
				return {
					title: formatMessage({
						id: 'label.claim_successful',
					}),
					icon: <IconWalletApprove32 />,
					buttonText: formatMessage({
						id: 'label.done',
					}),
				};

			default:
				return {
					title: formatMessage({
						id: 'label.claim_recurring_donaiton',
					}),
					icon: <IconDonation32 />,
					buttonText: formatMessage({
						id: 'label.confirm',
					}),
				};
		}
	};

	//view_on_block_explorer

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={handleStates()?.title}
			headerTitlePosition='left'
			headerIcon={handleStates()?.icon}
			hiddenClose
		>
			<ModalContainer>
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
								networkId: config.OPTIMISM_NETWORK_NUMBER,
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
					label={handleStates()?.buttonText}
					onClick={
						transactionState === ClaimTransactionState.SUCCESS
							? closeModal
							: handleConfirm
					}
					style={{ width: '100%' }}
					loading={loading}
					disabled={loading}
				/>
			</ModalContainer>
		</Modal>
	);
};

const FullWidthButton = styled(Button)`
	width: 100%;
`;

const ModalContainer = styled.div`
	min-width: 500px;
	padding: 24px;
`;

const CustomLink = styled.a`
	display: inline-block;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	padding-bottom: 16px;
`;

export default ClaimWithdrawalModal;
