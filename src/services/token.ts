import { captureException } from '@sentry/nextjs';
import config from '@/configuration';

export const fetchPrice = async (chainId: number, tokenAddress?: string) => {
	try {
		const chain =
			config.EVM_NETWORKS_CONFIG[chainId || 1].coingeckoChainName;
		const fetchCall = await fetch(
			`https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
		);
		const data = await fetchCall.json();
		return parseFloat(data[Object.keys(data)[0]]?.usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};

export const fetchETCPrice = async () => {
	try {
		const res = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=ethereum-classic&vs_currencies=usd',
		);
		const data = await res.json();
		return parseFloat(data['ethereum-classic'].usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};

export const fetchSolanaPrice = async () => {
	try {
		const res = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
		);
		const data = await res.json();
		return parseFloat(data.solana.usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};
