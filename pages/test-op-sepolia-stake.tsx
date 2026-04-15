import { useState } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import styled from 'styled-components';
import { useAccount, useSwitchChain } from 'wagmi';
import { parseUnits } from 'viem';
import { Container } from '@giveth/ui-design-system';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { approveERC20tokenTransfer, stakeGIV } from '@/lib/stakingPool';
import { waitForTransaction } from '@/lib/transaction';

const OP_SEPOLIA_CHAIN_ID = 11155420;
const OP_SEPOLIA_GIV_TOKEN_ADDRESS =
	'0x2f2c819210191750F2E11F7CfC5664a0eB4fd5e6';
const OP_SEPOLIA_GIVPOWER_LM_ADDRESS =
	'0xE6836325B13819CF38f030108255A5213491A725';
const OP_SEPOLIA_BLOCKSCOUT_BASE_URL =
	'https://optimism-sepolia.blockscout.com';

export default function TestOpSepoliaStakePage() {
	const { address, isConnected, chainId } = useAccount();
	const { open: openConnectModal } = useWeb3Modal();
	const { switchChain } = useSwitchChain();
	const isSafeEnv = useIsSafeEnvironment();

	const [amount, setAmount] = useState('0');
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState('Idle');
	const [txHash, setTxHash] = useState('');

	const onStake = async () => {
		try {
			if (!isConnected || !address) {
				setStatus('Connect wallet first.');
				return;
			}

			if (chainId !== OP_SEPOLIA_CHAIN_ID) {
				setStatus('Switch to OP Sepolia first.');
				return;
			}

			const trimmedAmount = amount.trim();
			if (!trimmedAmount || Number(trimmedAmount) <= 0) {
				setStatus('Enter a valid amount greater than 0.');
				return;
			}

			setIsLoading(true);
			setTxHash('');

			const amountWei = parseUnits(trimmedAmount, 18);

			setStatus('Approving token allowance...');
			const approved = await approveERC20tokenTransfer(
				amountWei,
				address,
				OP_SEPOLIA_GIVPOWER_LM_ADDRESS,
				OP_SEPOLIA_GIV_TOKEN_ADDRESS,
				OP_SEPOLIA_CHAIN_ID,
				isSafeEnv,
			);

			if (!approved) {
				setStatus('Approval failed.');
				return;
			}

			setStatus('Sending stake transaction...');
			const tx = await stakeGIV(
				amountWei,
				OP_SEPOLIA_GIVPOWER_LM_ADDRESS,
				OP_SEPOLIA_CHAIN_ID,
			);

			if (!tx) {
				setStatus('Stake transaction failed to submit.');
				return;
			}

			setTxHash(tx);
			setStatus('Waiting for confirmation...');
			const receipt = await waitForTransaction(tx, isSafeEnv);

			if (receipt.status === 'success') {
				setStatus('Stake successful.');
			} else {
				setStatus('Stake transaction failed.');
			}
		} catch (error: any) {
			setStatus(
				error?.shortMessage || error?.message || 'Unexpected error.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PageContainer>
			<Title>OP Sepolia GIV Staking Test</Title>
			<InfoRow>
				<strong>Network:</strong> OP Sepolia (11155420)
			</InfoRow>
			<InfoRow>
				<strong>GIV token:</strong> {OP_SEPOLIA_GIV_TOKEN_ADDRESS}
			</InfoRow>
			<InfoRow>
				<strong>Staking contract (LM):</strong>{' '}
				{OP_SEPOLIA_GIVPOWER_LM_ADDRESS}
			</InfoRow>

			<InputLabel htmlFor='stake-amount'>Amount (GIV)</InputLabel>
			<AmountInput
				id='stake-amount'
				type='number'
				min='0'
				step='any'
				value={amount}
				onChange={event => setAmount(event.target.value)}
				placeholder='e.g. 10'
				disabled={isLoading}
			/>

			<ButtonRow>
				<ActionButton
					type='button'
					onClick={() => openConnectModal()}
					disabled={isConnected || isLoading}
				>
					{isConnected ? 'Wallet Connected' : 'Connect Wallet'}
				</ActionButton>
				<ActionButton
					type='button'
					onClick={() =>
						switchChain({ chainId: OP_SEPOLIA_CHAIN_ID })
					}
					disabled={chainId === OP_SEPOLIA_CHAIN_ID || isLoading}
				>
					{chainId === OP_SEPOLIA_CHAIN_ID
						? 'On OP Sepolia'
						: 'Switch to OP Sepolia'}
				</ActionButton>
				<ActionButton
					type='button'
					onClick={onStake}
					disabled={isLoading}
				>
					{isLoading ? 'Processing...' : 'Stake'}
				</ActionButton>
			</ButtonRow>

			<StatusText>{status}</StatusText>
			{txHash && (
				<TxLink
					href={`${OP_SEPOLIA_BLOCKSCOUT_BASE_URL}/tx/${txHash}`}
					target='_blank'
					rel='noreferrer'
				>
					View transaction on Blockscout
				</TxLink>
			)}
		</PageContainer>
	);
}

const PageContainer = styled(Container)`
	padding-top: 120px;
	padding-bottom: 60px;
	max-width: 760px;
`;

const Title = styled.h1`
	margin-bottom: 16px;
`;

const InfoRow = styled.p`
	margin: 0 0 8px 0;
	word-break: break-all;
`;

const InputLabel = styled.label`
	display: block;
	margin-top: 20px;
	margin-bottom: 8px;
	font-weight: 600;
`;

const AmountInput = styled.input`
	width: 100%;
	padding: 10px 12px;
	border-radius: 8px;
	border: 1px solid #d9d9d9;
	font-size: 16px;
`;

const ButtonRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 16px;
`;

const ActionButton = styled.button`
	padding: 10px 14px;
	border-radius: 8px;
	border: none;
	background: #1f4fff;
	color: #fff;
	cursor: pointer;

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

const StatusText = styled.p`
	margin-top: 16px;
	font-weight: 600;
`;

const TxLink = styled.a`
	display: inline-block;
	margin-top: 8px;
`;
