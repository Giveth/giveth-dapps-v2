import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchGnosisTokenPrice } from '@/services/token';

export const useFetchGnosisThirdPartyTokensPrice = () => {
	return useQuery({
		queryKey: ['gnosisThirdPartyTokensPrice'],
		queryFn: async () => {
			const promises: Promise<string>[] = [];
			config.GNOSIS_CONFIG.regenStreams.forEach(streamConfig => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				promises.push(fetchGnosisTokenPrice(tokenAddress));
			});
			const prices = await Promise.all(promises);
			let res: { [x: string]: string } = {};
			config.GNOSIS_CONFIG.regenStreams.forEach((streamConfig, idx) => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				res[tokenAddress] = prices[idx];
			});
			return res;
		},
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
