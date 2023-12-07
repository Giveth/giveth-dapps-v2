import { useEffect, useState } from 'react';

import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { useAppSelector } from '@/features/hooks';
import { Zero } from '@/helpers/number';
import { chainInfoNames } from '@/features/subgraph/subgraph.helper';

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

	const subgraphValues = useAppSelector(
		state => state.subgraph,
		() => (hold ? true : false),
	);

	const { network, type } = poolStakingConfig;
	const currentValues = subgraphValues[chainInfoNames[network]];
	const { isLoaded } = currentValues;

	useEffect(() => {
		const cb = () => {
			if (isLoaded) {
				const promise: Promise<APR> =
					type === StakingType.GIV_GARDEN_LM ||
					type === StakingType.GIV_UNIPOOL_LM
						? getGivStakingAPR(network, currentValues, network)
						: getLPStakingAPR(poolStakingConfig, currentValues);
				promise.then(setApr).catch(e => {
					console.log('Error Calculating APR', e);
					setApr({ effectiveAPR: Zero });
				});
			} else {
				setApr({ effectiveAPR: Zero });
			}
		};

		cb();

		const interval = setInterval(cb, 60000); // Every one minutes

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isLoaded]);

	useEffect(() => {
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);

	return {
		apr,
		...userStakeInfo,
	};
};
