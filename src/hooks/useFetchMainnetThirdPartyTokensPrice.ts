import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchMainnetTokenPrices } from '@/services/token'; // Updated import path if necessary

export const useFetchMainnetThirdPartyTokensPrice = () => {
	return useQuery({
		queryKey: ['mainnetThirdPartyTokensPrice'],
		queryFn: async () => {
			const tokenIds = config.MAINNET_CONFIG.regenStreams?.map(
				streamConfig =>
					streamConfig.tokenAddressOnUniswapV2.toLowerCase(),
			);
			if (!tokenIds) return {};
			return await fetchMainnetTokenPrices(tokenIds); // Pass all token IDs at once
		},
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
