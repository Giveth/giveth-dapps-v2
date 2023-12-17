import { PublicKey } from '@solana/web3.js';
import { fetchEnsAddress } from '@wagmi/core';

export function isAddressENS(ens: string | undefined) {
	if (!ens) return false;
	return ens?.toLowerCase().indexOf('.eth') > -1;
}

// Before calling getAddressFromENS, check if user is on Mainnet
export async function getAddressFromENS(ens: string | undefined) {
	return await fetchEnsAddress({ name: ens! });
}

export function isSolanaAddress(address: string) {
	try {
		new PublicKey(address.trim());
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}
