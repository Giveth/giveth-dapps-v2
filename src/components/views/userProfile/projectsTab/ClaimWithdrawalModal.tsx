import styled from 'styled-components';
import {
	Button,
	IconDonation32,
	IconWalletApprove32,
	brandColors,
} from '@giveth/ui-design-system';
import { Address, encodeFunctionData } from 'viem';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import ClaimWithdrawalItem from './ClaimWithdrawalItem';
import { IProject } from '@/apollo/types/types';
import config from '@/configuration';
import superTokenABI from '@/artifacts/superToken.json';
import anchorContractABI from '@/artifacts/anchorContract.json';
import { ClaimWithdrawalStatus } from './ClaimWithdrawalStatus';
import { formatTxLink } from '@/lib/helpers';
import { ChainType } from '@/types/config';
import { ClaimTransactionState } from './type';
import { wagmiConfig } from '@/wagmiconfig';
interface IClaimWithdrawalModal extends IModal {
	selectedStream: ITokenWithBalance;
	project: IProject;
	anchorContractAddress: Address;
	transactionState: ClaimTransactionState;
	setTransactionState: (state: ClaimTransactionState) => void;
	balanceInUsd: number;
}

const contents = {
	[ClaimTransactionState.NOT_STARTED]: {
		title: 'label.claim_recurring_donaiton',
		icon: <IconDonation32 />,
		buttonText: 'label.confirm',
	},
	[ClaimTransactionState.PENDING]: {
		title: 'label.claim_recurring_donaiton',
		icon: <IconWalletApprove32 />,
		buttonText: 'label.withdrawing',
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

	const handleConfirm = async () => {
		try {
			const encodedDowngradeTo = encodeFunctionData({
				abi: superTokenABI.abi,
				functionName: 'downgradeTo',
				args: [optimismAddress, +selectedStream.balance.toString()],
			});

			setLoading(true);

			const tx = await writeContract(wagmiConfig, {
				abi: anchorContractABI.abi,
				address: anchorContractAddress,
				functionName: 'execute',
				chainId: config.OPTIMISM_NETWORK_NUMBER,
				args: [selectedStream.token.id, '', encodedDowngradeTo],
			});

			setTransactionState(ClaimTransactionState.PENDING);

			if (tx) {
				setTxHash(tx);
				await waitForTransactionReceipt(wagmiConfig, {
					hash: tx,
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

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: contents[transactionState].title,
			})}
			headerTitlePosition='left'
			headerIcon={contents[transactionState].icon}
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
					label={formatMessage({
						id: contents[transactionState].buttonText,
					})}
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
