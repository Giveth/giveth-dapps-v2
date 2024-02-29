import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import { waitForTransactionReceipt, getTransaction } from '@wagmi/core';
import { Address } from 'viem';
import { Connection } from '@solana/web3.js';
import { wagmiConfig } from '@/wagmiConfigs';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const maxAttempts = 200; // keeping it high as gnosis safe takes a while to confirm and processing
const attemptDelay = 5000;

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

		for (let attempts = 0; attempts < maxAttempts; attempts++) {
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
				await delay(attemptDelay);
			} catch (error) {
				console.error('Error while waiting for transaction:', error);
				throw error;
			}
		}

		throw new Error('Transaction status check timed out');
	}
};

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

export const retryFetchEVMTransaction = async (
	txHash: Address,
	retries: number = MAX_RETRIES,
) => {
	for (let i = 0; i < retries; i++) {
		const transaction = await getTransaction(wagmiConfig, {
			hash: txHash,
		}).catch(error => {
			console.log(
				'Attempt',
				i,
				'Fetching Transaction Error:',
				error,
				txHash,
			);
			return null;
		});

		if (transaction) return transaction;

		// If not found, wait for the delay time and try again
		await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
	}
	// Return null if the transaction is still not found after all retries
	throw new Error('Transaction not found');
};

export const retryFetchSolanaTransaction = async (
	solanaConnection: Connection,
	txHash: string,
	retries: number = MAX_RETRIES,
) => {
	for (let i = 0; i < retries; i++) {
		const transaction = await fetchSolanaTransaction(
			solanaConnection,
			txHash,
		).catch(error => {
			console.log(
				'Attempt',
				i,
				'Fetching Transaction Error:',
				error,
				txHash,
			);
			return null;
		});

		if (transaction) return transaction;

		// If not found, wait for the delay time and try again
		await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
	}
	// Return null if the transaction is still not found after all retries
	throw new Error('Transaction not found');
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
