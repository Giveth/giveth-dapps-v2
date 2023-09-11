import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { useAppSelector } from '@/features/hooks';

export interface IStakeInfo {
	apr: APR;
	earned: bigint;
	stakedAmount: bigint;
	notStakedAmount: bigint;
}

export const useStakingPool = (
	poolStakingConfig: SimplePoolStakingConfig,
	hold: boolean = false,
): IStakeInfo => {
	const [apr, setApr] = useState<APR | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: 0n,
		notStakedAmount: 0n,
		stakedAmount: 0n,
	});

	const { library, chainId } = useWeb3React();
	const currentValues = useAppSelector(
		state => state.subgraph.currentValues,
		() => (hold ? true : false),
	);

	const { network, type } = poolStakingConfig;
	const { isLoaded } = currentValues;

	useEffect(() => {
		const cb = () => {
			console.log('Calculating APR');
			if (isLoaded) {
				const _library = chainId === network ? library : undefined;
				const promise: Promise<APR> =
					type === StakingType.GIV_GARDEN_LM ||
					type === StakingType.GIV_UNIPOOL_LM
						? getGivStakingAPR(network, currentValues, _library)
						: getLPStakingAPR(poolStakingConfig, currentValues);
				promise.then(setApr).catch(() => setApr({ effectiveAPR: 0n }));
			} else {
				setApr({ effectiveAPR: 0n });
			}
		};

		cb();

		const interval = setInterval(cb, 60000); // Every one minutes

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [library, chainId, isLoaded]);

	useEffect(() => {
		console.log('Calculating user stake info');
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);

	return {
		apr,
		...userStakeInfo,
	};
};
