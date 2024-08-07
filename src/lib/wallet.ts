import { PublicKey } from '@solana/web3.js';
import { getEnsAddress } from '@wagmi/core';
import { StrKey } from '@stellar/stellar-sdk';
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
		const isOnCurve = PublicKey.isOnCurve(publicKey);
		return typeof isOnCurve === 'boolean';
	} catch (e) {
		console.error(e);
		return false;
	}
}

export function isStellarAddress(address: string) {
	return StrKey.isValidEd25519PublicKey(address.trim());
}
