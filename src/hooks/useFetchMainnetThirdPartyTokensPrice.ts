import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchMainnetTokenPrice } from '@/services/token';

export const useFetchMainnetThirdPartyTokensPrice = () => {
	return useQuery({
		queryKey: ['mainnetThirdPartyTokensPrice'],
		queryFn: async () => {
			const promises: Promise<string>[] = [];
			config.MAINNET_CONFIG.regenStreams.forEach(streamConfig => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				promises.push(fetchMainnetTokenPrice(tokenAddress));
			});
			const prices = await Promise.all(promises);
			let res: { [x: string]: string } = {};
			config.MAINNET_CONFIG.regenStreams.forEach((streamConfig, idx) => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				res[tokenAddress] = prices[idx];
			});
			return res;
		},
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
