import SafeApiKit from '@safe-global/api-kit';

export const getTxFromSafeTxId = async (
	safeTxHash: string,
	chainId: number,
) => {
	try {
		const safeService = new SafeApiKit({
			chainId: BigInt(chainId),
			// Optional. txServiceUrl must be used to set a custom service. For example on chains where Safe doesn't run services.
			// txServiceUrl: 'https://safe-transaction-mainnet.safe.global'
		});

		const tx = await safeService.getTransaction(safeTxHash);
		return tx;
	} catch (error) {
		console.log("Couldn't get tx from safe tx hash", error);
		return null;
	}
};
