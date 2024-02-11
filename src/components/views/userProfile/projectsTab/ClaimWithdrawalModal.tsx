import styled from 'styled-components';
import { Button, IconDonation32, brandColors } from '@giveth/ui-design-system';
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

	console.log('Selected Streams', selectedStream);
	console.log('Selected Streams', selectedStream);
	const projectName = project.title || '';
	const optimismAddress = project.addresses?.find(
		address => address.networkId === config.OPTIMISM_NETWORK_NUMBER,
	)?.address;

	console.log('Optimism address', optimismAddress);

	const [loading, setLoading] = useState(false);
	console.log('Balance', selectedStream.balance.toString());

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
			console.log('Clicked inside if');
			const tx = await executeContractWrite.writeAsync?.();
			console.log('tx', tx);
			if (tx?.hash) {
				setTxHash(tx.hash);
				const data = await waitForTransaction({
					hash: tx.hash,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
				});
				setTransactionState(ClaimTransactionState.SUCCESS);
				console.log('executeData', data);
			}
		} catch (error) {
			setTransactionState(ClaimTransactionState.NOT_STARTED);
			console.log('error', error);
		} finally {
			setLoading(false);
		}
	};

	console.log('Streamm', selectedStream);

	//view_on_block_explorer

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Claim Recurring Donaiton'
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
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
					label={
						transactionState === ClaimTransactionState.SUCCESS
							? 'Done'
							: 'Confirm'
					}
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
