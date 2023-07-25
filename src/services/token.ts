import { captureException } from '@sentry/nextjs';
import { initializeApollo } from '@/apollo/apolloClient';
import config from '@/configuration';

const apolloClient = initializeApollo();

export const fetchPrice = async (chainId: number, tokenAddress?: string) => {
	try {
		let chain = 'ethereum';
		switch (chainId) {
			case config.CELO_NETWORK_NUMBER:
				chain = 'celo';
				break;
			case config.OPTIMISM_NETWORK_NUMBER:
				chain = 'optimistic-ethereum';
				break;
			case config.POLYGON_NETWORK_NUMBER:
				chain = 'polygon-pos';
				break;
			case config.XDAI_NETWORK_NUMBER:
				chain = 'xdai';
				break;
			default:
				break;
		}
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
