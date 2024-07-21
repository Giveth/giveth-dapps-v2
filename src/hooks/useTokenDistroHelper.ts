import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { RegenStreamConfig } from '@/types/config';

export const useTokenDistroHelper = (
	poolNetwork: number,
	regenStreamConfig?: RegenStreamConfig,
	hold: boolean = false,
) => {
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();
	const { address } = useAccount();
	const queryClient = useQueryClient();
	const currentValues = queryClient.getQueryData([
		'subgraph',
		poolNetwork,
		address,
	]);
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
