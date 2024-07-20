import { useAccount } from 'wagmi';
import { useQueries } from '@tanstack/react-query';
import { Address } from 'viem';
import config from '@/configuration';
import { fetchSubgraph } from '@/services/subgraph.service';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';

export const fetchSubgraphData = async (
	chainId?: number,
	address?: Address,
) => {
	if (!chainId || !address) return {};
	// try {
	let response;
	let uri = config.EVM_NETWORKS_CONFIG[chainId]?.subgraphAddress;

	if (!uri) {
		response = {};
	} else {
		response = await fetchSubgraph(
			SubgraphQueryBuilder.getChainQuery(chainId, address),
			chainId,
		);
	}
	return transformSubgraphData({
		...response,
		networkNumber: chainId,
	});
	// } catch (e) {
	// 	console.error(`Error on query ${chainId} subgraph:`, e);
	// 	captureException(e, {
	// 		tags: {
	// 			section: 'fetch${chainId}Subgraph',
	// 		},
	// 	});
	// 	return {};
	// }
};

const SubgraphController = () => {
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address } = useAccount();

	useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address],
			queryFn: async () => {
				return await fetchSubgraphData(chain.id, address);
			},
			staleTime:
				chainId === chain.id
					? config.ACTIVE_SUBGRAPH_POLLING_INTERVAL
					: config.SUBGRAPH_POLLING_INTERVAL,
		})),
	});

	return null;
};

export default SubgraphController;
