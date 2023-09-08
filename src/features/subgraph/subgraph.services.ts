import { captureException } from '@sentry/nextjs';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';

export const fetchChainInfo = async (chainId: number, userAddress?: string) => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getChainQuery(chainId, userAddress),
			chainId,
		);
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
		return null;
	}
};
