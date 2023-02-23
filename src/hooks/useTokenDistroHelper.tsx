import { useState, useEffect } from 'react';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import config from '@/configuration';
import { StreamType, RegenFarmConfig } from '@/types/config';
import { useAppSelector } from '@/features/hooks';

export const useTokenDistroHelper = (
	poolNetwork: number,
	regenStreamType?: StreamType,
	regenStreamConfig?: RegenFarmConfig,
) => {
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();

	const { mainnetValues, xDaiValues } = useAppSelector(
		state => state.subgraph,
	);
	const currentValues =
		poolNetwork === config.XDAI_NETWORK_NUMBER ? xDaiValues : mainnetValues;
	const sdh = new SubgraphDataHelper(currentValues);

	useEffect(() => {
		if (regenStreamType) {
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
	}, [currentValues, regenStreamConfig, regenStreamType]);
	return { tokenDistroHelper, sdh };
};
