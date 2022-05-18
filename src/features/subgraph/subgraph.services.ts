import { captureException } from '@sentry/nextjs';
import config from '@/configuration';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';
import { defaultSubgraphValues } from './subgraph.slice';

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
