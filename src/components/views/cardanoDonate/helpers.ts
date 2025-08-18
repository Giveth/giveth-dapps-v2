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
