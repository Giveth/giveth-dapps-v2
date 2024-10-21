import { useState } from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
	PublicKey,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { getTotalGIVpower } from '@/helpers/givpower';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { fetchSubgraphData } from '@/services/subgraph.service';

const YourApp = () => {
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const queryClient = useQueryClient();
	const { address, chain } = useAccount();
	const subgraphValues = useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address],
			queryFn: async () => {
				return await fetchSubgraphData(chain.id, address);
			},
			staleTime: config.SUBGRAPH_POLLING_INTERVAL,
		})),
	});

	const { data } = useQuery({
		queryKey: ['interactedBlockNumber', chain?.id],
		queryFn: () => 0,
		staleTime: Infinity,
	});

	console.log('data', data);

	// Solana wallet hooks
	const {
		publicKey,
		disconnect: solanaWalletDisconnect,
		signMessage: solanaSignMessage,
		sendTransaction: solanaSendTransaction,
		connecting: solanaIsConnecting,
		connected: solanaIsConnected,
	} = useWallet();

	const { connection: solanaConnection } = useConnection();

	const donateToSolana = async () => {
		if (!publicKey) {
			console.error('Wallet is not connected');
			return;
		}

		console.log('Connection endpoint:', solanaConnection.rpcEndpoint);

		const to = 'B6bfJUMPnpL2ddngPPe3M7QNpvrv7hiYYiGtg9iCJDMS';
		const donationValue = 0.001;

		console.log('publicKey', publicKey);
		console.log('Public Key string:', publicKey.toString());

		// Ensure the wallet has enough funds by requesting an airdrop if necessary
		let balance = await solanaConnection.getBalance(publicKey);
		console.log('Initial balance:', balance);
		if (balance < LAMPORTS_PER_SOL) {
			console.log('Airdropping 1 SOL for testing...');
			const airdropSignature = await solanaConnection.requestAirdrop(
				publicKey,
				LAMPORTS_PER_SOL,
			);
			await solanaConnection.confirmTransaction(airdropSignature);
			balance = await solanaConnection.getBalance(publicKey);
			console.log('New balance:', balance);
		}

		const lamports = new BigNumber(donationValue)
			.times(LAMPORTS_PER_SOL)
			.toFixed();

		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: publicKey!,
				toPubkey: new PublicKey(to),
				lamports: BigInt(lamports),
			}),
		);

		console.log('Transaction', transaction);

		console.log(
			'Fee Payer:',
			transaction.feePayer ? transaction.feePayer.toBase58() : 'None',
		);

		transaction.feePayer = publicKey;

		const simulationResult =
			await solanaConnection.simulateTransaction(transaction);
		console.log('Simulation Result:', simulationResult);

		if (simulationResult.value.err) {
			console.error('Simulation error:', simulationResult.value.err);
			return;
		}

		const hash = await solanaSendTransaction(transaction, solanaConnection);

		console.log('hash', hash);
	};

	return (
		<div>
			<button onClick={donateToSolana}>DONATE ON SOLANA</button>
			<w3m-button />
			<div>
				<button
					onClick={() => {
						const totalgivpower = getTotalGIVpower(
							subgraphValues,
							address,
						);
						console.log(
							'totalgivpower',
							formatWeiHelper(totalgivpower.total),
						);
					}}
				>
					Test Button
				</button>
			</div>
			<div>
				{data}

				{chain?.id && (
					<button
						onClick={() => {
							queryClient.setQueryData(
								['interactedBlockNumber', chain.id!],
								12,
							);
						}}
					>
						update query data
					</button>
				)}
			</div>
			{failedModalType && (
				<FailedDonation
					txUrl={'0x01121212'}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}
		</div>
	);
};

export default YourApp;
