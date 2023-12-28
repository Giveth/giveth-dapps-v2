import { captureException } from '@sentry/nextjs';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';

export const fetchChainInfo = async (chainId: number, userAddress?: string) => {
	try {
		let response;
		let uri = config.NETWORKS_CONFIG[chainId]?.subgraphAddress;

		if (!uri) {
			response = {};
		} else {
			response = await fetchSubgraph(
				SubgraphQueryBuilder.getChainQuery(chainId, userAddress),
				chainId,
			);
		}
		return transformSubgraphData({
			...response,
			networkNumber: chainId,
		});
	} catch (e) {
		console.error(`Error on query ${chainId} subgraph:`, e);
		captureException(e, {
			tags: {
				section: 'fetch${chainId}Subgraph',
			},
		});
		return {};
	}
};
