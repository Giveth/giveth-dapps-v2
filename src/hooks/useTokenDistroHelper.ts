import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { RegenStreamConfig } from '@/types/config';
import { fetchSubgraphData } from '@/components/controller/subgraph.ctrl';
import config from '@/configuration';

export const useTokenDistroHelper = (
	poolNetwork: number,
	regenStreamConfig?: RegenStreamConfig,
	hold: boolean = false,
) => {
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();
	const { address } = useAccount();
	const currentValues = useQuery({
		queryKey: ['subgraph', poolNetwork, address],
		queryFn: async () => await fetchSubgraphData(poolNetwork, address),
		enabled: !hold,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
	const sdh = useMemo(
		() => new SubgraphDataHelper(currentValues.data),
		[currentValues],
	);

	useEffect(() => {
		if (regenStreamConfig) {
			setTokenDistroHelper(
				new TokenDistroHelper(
					sdh.getTokenDistro(
						regenStreamConfig?.tokenDistroAddress as string,
					),
				),
			);
		} else {
			setTokenDistroHelper(
				new TokenDistroHelper(sdh.getGIVTokenDistro()),
			);
		}
	}, [currentValues.data, regenStreamConfig, sdh]);
	return { tokenDistroHelper, sdh };
};
