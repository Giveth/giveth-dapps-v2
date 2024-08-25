import { useQuery } from '@tanstack/react-query';
import config from '@/configuration';
import { fetchGnosisTokenPrices } from '@/services/token'; // Updated import path if necessary

export const useFetchGnosisThirdPartyTokensPrice = () => {
	return useQuery({
		queryKey: ['gnosisThirdPartyTokensPrice'],
		queryFn: async () => {
			const tokenIds = config.GNOSIS_CONFIG.regenStreams.map(
				streamConfig =>
					streamConfig.tokenAddressOnUniswapV2.toLowerCase(),
			);
			return await fetchGnosisTokenPrices(tokenIds); // Pass all token IDs at once
		},
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
};
