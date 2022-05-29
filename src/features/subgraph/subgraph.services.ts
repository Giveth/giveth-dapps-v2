import { captureException } from '@sentry/nextjs';
import config from '@/configuration';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';
import { defaultSubgraphValues } from './subgraph.slice';
import { getRequest } from '@/helpers/requests';

export const fetchMainnetInfo = async (userAddress = '') => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getMainnetQuery(userAddress),
			config.MAINNET_NETWORK_NUMBER,
		);
		return transformSubgraphData(response);
	} catch (e) {
		console.error('Error on query mainnet subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchMainnetSubgraph',
			},
		});
		return defaultSubgraphValues;
	}
};

export const fetchXDaiInfo = async (userAddress = '') => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getXDaiQuery(userAddress),
			config.XDAI_NETWORK_NUMBER,
		);
		return transformSubgraphData(response);
	} catch (e) {
		console.error('Error on query xDai subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchxDaiSubgraph',
			},
		});
		return defaultSubgraphValues;
	}
};

export const fetchUniswapSubgraphTokenPrice = async (
	subgraphUrl: string | undefined,
	tokenAddress: string,
): Promise<string> => {
	if (!subgraphUrl || !tokenAddress) return '0';

	try {
		const query = `
		{
			token(id:"${tokenAddress.toLowerCase()}") {
				derivedETH
			}
		}
		`;
		const body = { query };
		const res = await fetch(subgraphUrl, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const { data } = await res.json();
		return data?.token?.derivedETH || '0';
	} catch (e) {
		console.error('Error fetching token price:', tokenAddress, e);
		captureException(e, {
			tags: {
				section: 'fetUniswapSubgraphTokenPrice',
			},
		});
		return '0';
	}
};

export const fetchEthPrice = async (): Promise<string> => {
	const res = await getRequest(
		'https://feathers.giveth.io/conversionRates?from=ETH&to=USD&interval=hourly',
	);
	return res.rate;
};
