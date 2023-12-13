import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import { waitForTransaction as wagmiWaitForTransaction } from '@wagmi/core';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const maxAttempts = 200; // keeping it high as gnosis safe takes a while to confirm and processing
const attemptDelay = 5000;

export const waitForTransaction = async (
	hash: `0x${string}`,
	isSafeEnv?: boolean,
) => {
	if (!isSafeEnv) {
		return await wagmiWaitForTransaction({ hash });
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
					return await wagmiWaitForTransaction({
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
