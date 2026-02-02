import SafeApiKit from '@safe-global/api-kit';
import { ethers } from 'ethers';
import { wagmiConfig } from '@/wagmiConfigs';
import { getEthersProvider } from '@/helpers/ethers';

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
		console.error("Couldn't get tx from safe tx hash", error);
		return null;
	}
};

export async function isGnosisSafeAddress(address: string): Promise<boolean> {
	try {
		const provider = await getEthersProvider(wagmiConfig);

		if (!provider) {
			return false;
		}

		// Validate input address first
		if (!ethers.utils.isAddress(address)) {
			console.log(
				'Invalid address provided to isGnosisSafeAddress:',
				address,
			);
			return false;
		}

		const result = await provider.call({
			to: address,
			data: '0xa619486e',
		});

		// Validate result before processing
		if (!result || result === '0x' || result.length < 42) {
			console.log('Invalid result from provider.call:', result);
			return false;
		}

		// Extract the last 40 characters (without 0x prefix) and check if it's 40 characters long
		const addressPart = result.slice(-40);
		if (addressPart.length !== 40) {
			console.log('Invalid address part extracted:', addressPart);
			return false;
		}

		// Parse returned address from bytes
		const masterCopy = ethers.utils.getAddress('0x' + addressPart);
		return ethers.utils.isAddress(masterCopy);
	} catch (e) {
		console.error('Error checking if address is Gnosis Safe', e);
		return false;
	}
}
