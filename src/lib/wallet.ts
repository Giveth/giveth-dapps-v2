import { PublicKey } from '@solana/web3.js';
import { getEnsAddress } from '@wagmi/core';
import { wagmiConfig } from '@/wagmiConfigs';

export function isAddressENS(ens: string | undefined) {
	if (!ens) return false;
	return ens?.toLowerCase().indexOf('.eth') > -1;
}

// Before calling getAddressFromENS, check if user is on Mainnet
export async function getAddressFromENS(ens: string | undefined) {
	return await getEnsAddress(wagmiConfig, { name: ens! });
}

export function isSolanaAddress(address: string) {
	try {
		const publicKey = new PublicKey(address.trim());
		return PublicKey.isOnCurve(publicKey);
	} catch (e) {
		console.log(e);
		return false;
	}
}
