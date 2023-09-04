import { useState, useEffect } from 'react';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { RegenStreamConfig } from '@/types/config';
import { useAppSelector } from '@/features/hooks';

export const useTokenDistroHelper = (
	poolNetwork: number,
	regenStreamConfig?: RegenStreamConfig,
	hold: boolean = false,
) => {
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();

	const currentValues = useAppSelector(
		state => state.subgraph.currentValues,
		() => (hold ? true : false),
	);
	const sdh = new SubgraphDataHelper(currentValues);

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
	}, [currentValues, regenStreamConfig]);
	return { tokenDistroHelper, sdh };
};
