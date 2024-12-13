import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import config from '@/configuration';
import { fetchSubgraphData } from '@/services/subgraph.service';

export const useSubgraphInfo = (chainId?: number) => {
	const { address, chainId: accountChainId } = useAccount();
	const _chainId = chainId || accountChainId;
	return useQuery({
		queryKey: ['subgraph', _chainId, address],
		queryFn: async () => await fetchSubgraphData(_chainId, address),
		enabled: !!_chainId,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
