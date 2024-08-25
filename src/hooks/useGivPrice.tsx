import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchGnosisTokenPrice } from '@/services/token';

export const useFetchGIVPrice = (chainId?: number) => {
	const _chainId = chainId || config.GNOSIS_NETWORK_NUMBER;
	const tokenAddress =
		config.EVM_NETWORKS_CONFIG[_chainId]?.tokenAddressOnUniswapV2;
	return useQuery({
		queryKey: ['price', tokenAddress],
		queryFn: () => fetchGnosisTokenPrice(tokenAddress),
		enabled: !!tokenAddress,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
