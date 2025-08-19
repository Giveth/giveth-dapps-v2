import { CardanoWalletInfo } from './types';

// Connect user with selected wallet
export const handleWalletSelection = (
	wallet: CardanoWalletInfo,
	setSelectedWallet: (wallet: CardanoWalletInfo) => void,
	connect: (walletName: string) => void,
) => {
	localStorage.setItem('selectedCardanoWallet', JSON.stringify(wallet));
	setSelectedWallet(wallet);
	connect(wallet.name);
};

export const handleWalletDisconnect = (
	disconnect: () => void,
	setSelectedWallet: (wallet: CardanoWalletInfo | undefined) => void,
) => {
	localStorage.removeItem('selectedCardanoWallet');
	setSelectedWallet(undefined);
	disconnect();
};

export const getCardanoStoredWalet = () => {
	const storedCardanoWallet = localStorage.getItem('selectedCardanoWallet');
	if (storedCardanoWallet) {
		return JSON.parse(storedCardanoWallet);
	}
	return null;
};

export const getCoingeckoADAPrice = async () => {
	try {
		const response = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd',
		);
		const data = await response.json();
		return data.cardano.usd;
	} catch (error) {
		console.error('Error getting ADA price:', error);
		return null;
	}
};

export async function fetchTokenPriceInAdaMuesli(
	policyId: string,
	assetNameHex: string,
) {
	try {
		const url = `https://api.muesliswap.com/price?base-policy-id=${policyId}&base-tokenname=${assetNameHex}`;
		const r = await fetch(url, { cache: 'no-store' });
		if (!r.ok) return undefined;
		const j = await r.json();
		const p = Number(j?.price);
		return p > 0 ? p : 0;
	} catch (error) {
		console.error('Error getting token price:', error);
		return 0;
	}
}

// Helper function to convert raw quantity to real token amount
export const formatTokenQuantity = (
	quantity: string,
	decimals: number,
): number => {
	const rawAmount = Number(quantity);
	return rawAmount / Math.pow(10, decimals);
};

export const normalizeAmount = (input: string): number => {
	// Replace comma with dot, trim spaces
	const normalized = input.replace(',', '.').trim();
	const value = Number(normalized);

	if (isNaN(value) || value <= 0) {
		throw new Error(`Invalid amount: "${input}"`);
	}
	return value;
};

export function toUnits(value: string | number, decimals: number): bigint {
	const s = String(value).trim().replace(',', '.');
	if (!s.includes('.')) return BigInt(s) * 10n ** BigInt(decimals);
	const [i, fRaw] = s.split('.');
	const f = (fRaw || '').slice(0, decimals).padEnd(decimals, '0');
	return BigInt(i || '0') * 10n ** BigInt(decimals) + BigInt(f || '0');
}

// Helper function to extract ADA balance
export async function getAdaBalance(wallet: any): Promise<number> {
	if (!wallet) return 0;

	try {
		const balance = await wallet.getBalance(); // returns array of assets
		const adaAsset = balance.find(
			(asset: any) => asset.unit === 'lovelace',
		);

		if (!adaAsset) return 0;

		// Convert from lovelace (1 ADA = 1e6 lovelace)
		return Number(adaAsset.quantity) / 1_000_000;
	} catch (e) {
		console.error('Error getting ADA balance:', e);
		return 0;
	}
}

/**
 * Estimate if the user has enough balance to cover donation + fees
 *
 * @param amount - donation amount in lovelace (BigInt)
 * @param balance - user token balance in lovelace (BigInt)
 * @param buffer - safety buffer for tx fee + min-ADA (default 2 ADA)
 * @returns boolean
 */
export function hasSufficientBalance(
	amount: bigint,
	balance: bigint,
	buffer: bigint = 2_000_000n, // ~2 ADA
): boolean {
	// donation + buffer must be <= balance
	return amount + buffer <= balance;
}
