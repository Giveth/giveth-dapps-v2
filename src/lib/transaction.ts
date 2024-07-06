import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import { waitForTransactionReceipt, getTransaction } from '@wagmi/core';
import { Address } from 'viem';
import { Connection } from '@solana/web3.js';
import { wagmiConfig } from '@/wagmiConfigs';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_ATTEMPTS = 200; // keeping it high as gnosis safe takes a while to confirm and processing
const DELAY_MS = 5000;
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

const retryFetchTransaction = async <T>(
	fetchFunction: () => Promise<T>,
	maxRetries: number = MAX_RETRIES,
	retryDelay: number = RETRY_DELAY,
): Promise<T> => {
	for (let i = 0; i < maxRetries; i++) {
		try {
			const result = await fetchFunction();
			if (result) return result;
		} catch (error) {
			console.error(
				`Attempt ${i + 1} - Fetching Transaction Error:`,
				error,
			);
		}
		await delay(retryDelay);
	}
	throw new Error('Transaction not found after maximum retries');
};

export const waitForTransaction = async (
	hash: `0x${string}`,
	isSafeEnv?: boolean,
) => {
	if (!isSafeEnv) {
		return await waitForTransactionReceipt(wagmiConfig, { hash });
	} else {
		const sdk = new SafeAppsSDK({
			allowedDomains: [/app.safe.global$/],
			debug: false,
		});

		for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
			try {
				const queued = await sdk.txs.getBySafeTxHash(hash);
				console.log(
					`Attempt ${
						attempts + 1
					}: Gnosis Safe transaction status - ${queued.txStatus}`,
				);
				if (
					queued.txStatus !==
						TransactionStatus.AWAITING_CONFIRMATIONS &&
					queued.txStatus !== TransactionStatus.AWAITING_EXECUTION
				) {
					return await waitForTransactionReceipt(wagmiConfig, {
						hash: queued.txHash as `0x${string}`,
					});
				}
				await delay(DELAY_MS);
			} catch (error) {
				console.error('Error while waiting for transaction:', error);
				throw error;
			}
		}

		throw new Error('Transaction status check timed out');
	}
};

export const retryFetchEVMTransaction = async (txHash: Address) => {
	return retryFetchTransaction(() =>
		getTransaction(wagmiConfig, { hash: txHash }),
	);
};

export const retryFetchSolanaTransaction = async (
	solanaConnection: Connection,
	txHash: string,
) => {
	return retryFetchTransaction(() =>
		fetchSolanaTransaction(solanaConnection, txHash),
	);
};

const fetchSolanaTransaction = async (
	solanaConnection: Connection,
	hash: string,
) => {
	const transaction = await solanaConnection.getTransaction(hash);
	const from: string =
		transaction?.transaction.message.accountKeys[0].toBase58()!;
	if (!from) {
		throw new Error('Solana transaction from not found');
	}
	return {
		hash,
		chainId: 0,
		nonce: null,
		from,
		transactionObj: transaction,
	};
};
