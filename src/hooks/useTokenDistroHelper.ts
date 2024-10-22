import { useState, useEffect, useMemo } from 'react';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { RegenStreamConfig } from '@/types/config';
import { useSubgraphInfo } from './useSubgraphInfo';

export const useTokenDistroHelper = (
	poolNetwork: number,
	regenStreamConfig?: RegenStreamConfig,
	hold: boolean = false,
) => {
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();
	const currentValues = useSubgraphInfo(poolNetwork);
	const sdh = useMemo(
		() => new SubgraphDataHelper(currentValues.data),
		[currentValues.data],
	);

	useEffect(() => {
		const updateHelper = () => {
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
		};

		updateHelper(); // Initial update

		const interval = setInterval(updateHelper, 5000); // Periodic update every 5 seconds

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [currentValues.data, regenStreamConfig, sdh]);

	return { tokenDistroHelper, sdh };
};
