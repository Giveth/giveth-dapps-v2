import { useEffect, useState } from 'react';

import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { Zero } from '@/helpers/number';
import { useSubgraphInfo } from './useSubgraphInfo';

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
	const currentValues = useSubgraphInfo(poolStakingConfig.network);

	useEffect(() => {
		const { network, type } = poolStakingConfig;
		const cb = () => {
			if (currentValues.data) {
				const promise: Promise<APR> =
					type === StakingType.GIV_GARDEN_LM ||
					type === StakingType.GIV_UNIPOOL_LM
						? getGivStakingAPR(network, currentValues.data, network)
						: getLPStakingAPR(
								poolStakingConfig,
								currentValues.data,
							);
				promise.then(setApr).catch(e => {
					console.error('Error Calculating APR', e);
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
	}, [currentValues.data, poolStakingConfig]);

	useEffect(() => {
		if (!currentValues.data) return;
		setUserStakeInfo(
			getUserStakeInfo(currentValues.data, poolStakingConfig),
		);
	}, [currentValues.data, poolStakingConfig]);

	return {
		apr,
		...userStakeInfo,
	};
};
