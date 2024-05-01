import styled from 'styled-components';
import {
	Button,
	IconDonation32,
	IconWalletApprove32,
	brandColors,
	P,
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
import ISETH from '@/artifacts/ISETH.json';
import anchorContractABI from '@/artifacts/anchorContract.json';
import { ClaimWithdrawalStatus } from './ClaimWithdrawalStatus';
import { formatTxLink } from '@/lib/helpers';
import { ChainType } from '@/types/config';
import { ClaimTransactionState } from './type';
import { wagmiConfig } from '@/wagmiConfigs';
import { ensureCorrectNetwork } from '@/helpers/network';
interface IClaimWithdrawalModal extends IModal {
	selectedStream: ITokenWithBalance;
	project: IProject;
	anchorContractAddress: Address;
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
	balanceInUsd,
	refetch,
}: IClaimWithdrawalModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [transactionState, setTransactionState] =
		useState<ClaimTransactionState>(ClaimTransactionState.NOT_STARTED);
	const [txHash, setTxHash] = useState<Address>();
	const { formatMessage } = useIntl();

	const projectName = project.title || '';
	const optimismAddress = project.addresses?.find(
		address => address.networkId === config.OPTIMISM_NETWORK_NUMBER,
	)?.address;

	const isETHx = selectedStream.token.symbol.toLowerCase() === 'ethx';
	const handleConfirm = async () => {
		console.log('anchorContractAddress', anchorContractAddress);
		try {
			console.log('isETHx', isETHx);
			await ensureCorrectNetwork(config.OPTIMISM_NETWORK_NUMBER);
			const encodedDowngradeTo = isETHx
				? encodeFunctionData({
						abi: ISETH.abi,
						functionName: 'downgradeToETH',
						args: [+selectedStream.balance.toString()],
					})
				: encodeFunctionData({
						abi: superTokenABI.abi,
						functionName: 'downgradeTo',
						args: [
							optimismAddress,
							+selectedStream.balance.toString(),
						],
					});

			setTransactionState(
				isETHx
					? ClaimTransactionState.DOWNGRADING_TO_ETH
					: ClaimTransactionState.WITHDRAWING,
			);

			// Execute the anchor contract
			console.log('Start execute downgrading on Anchor contract');
			const tx = await writeContract(wagmiConfig, {
				abi: anchorContractABI.abi,
				address: anchorContractAddress,
				functionName: 'execute',
				chainId: config.OPTIMISM_NETWORK_NUMBER,
				args: [selectedStream.token.id, '', encodedDowngradeTo],
			});

			if (tx) {
				setTxHash(tx);
				const withdrawRes = await waitForTransactionReceipt(
					wagmiConfig,
					{
						hash: tx,
						chainId: config.OPTIMISM_NETWORK_NUMBER,
					},
				);

				setTransactionState(
					isETHx
						? ClaimTransactionState.TRANSFERRING_ETH
						: ClaimTransactionState.SUCCESS,
				);

				// Transfer ETH to the project op address
				if (isETHx) {
					console.log("Start transfer ETH to project's op address");
					const transferEthTx = await writeContract(wagmiConfig, {
						abi: anchorContractABI.abi,
						address: anchorContractAddress,
						functionName: 'execute',
						chainId: config.OPTIMISM_NETWORK_NUMBER,
						args: [
							optimismAddress,
							+selectedStream.balance.toString(),
							'',
						],
					});
					console.log('transferEthTx', transferEthTx);
					if (transferEthTx) {
						await waitForTransactionReceipt(wagmiConfig, {
							hash: transferEthTx,
							chainId: config.OPTIMISM_NETWORK_NUMBER,
						});
					}
					setTransactionState(ClaimTransactionState.SUCCESS);
				}

				refetch();
			}
		} catch (error) {
			console.error(error);
			console.log('anchorContractAddress', anchorContractAddress);
			setTransactionState(ClaimTransactionState.NOT_STARTED);
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
						You'll need to sign two transactions to withdraw ETH to
						your recipient address.{' '}
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
	min-width: 500px;
	padding: 24px;
`;

const CustomLink = styled.a`
	display: inline-block;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	padding-bottom: 16px;
`;

const TransactionWarning = styled(P)`
	padding-bottom: 16px;
`;

export default ClaimWithdrawalModal;
