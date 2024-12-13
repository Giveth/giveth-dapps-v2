import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchGnosisTokenPrices } from '@/services/token';

export const useFetchGIVPrice = () => {
	const _chainId = config.GNOSIS_NETWORK_NUMBER;
	const tokenAddress =
		config.EVM_NETWORKS_CONFIG[_chainId]?.tokenAddressOnUniswapV2;
	return useQuery({
		queryKey: ['price', tokenAddress],
		queryFn: async () => {
			if (!tokenAddress) return '0';
			const _tokenAddress = tokenAddress.toLowerCase();
			const res = await fetchGnosisTokenPrices([_tokenAddress]);
			return res[_tokenAddress] || '0';
		},
		enabled: !!tokenAddress,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
