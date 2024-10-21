import { useQueries } from '@tanstack/react-query';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import config from '@/configuration';
import { fetchSubgraphData } from '@/services/subgraph.service';

export const useFetchSubgraphDataForAllChains = () => {
	const { address } = useAccount();
	return useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address] as [
				string,
				number,
				Address,
			],
			queryFn: async () => await fetchSubgraphData(chain.id, address),
			staleTime: config.SUBGRAPH_POLLING_INTERVAL,
			enabled: !!address,
		})),
	});
};
