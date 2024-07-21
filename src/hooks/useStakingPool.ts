import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { Zero } from '@/helpers/number';

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
	const { chain, address } = useAccount();
	const queryClient = useQueryClient();
	const currentValues = queryClient.getQueryData([
		'subgraph',
		chain?.id,
		address,
	]);

	const { network, type } = poolStakingConfig;

	useEffect(() => {
		const cb = () => {
			if (currentValues) {
				const promise: Promise<APR> =
					type === StakingType.GIV_GARDEN_LM ||
					type === StakingType.GIV_UNIPOOL_LM
						? getGivStakingAPR(network, currentValues, network)
						: getLPStakingAPR(poolStakingConfig, currentValues);
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
	}, [currentValues]);

	useEffect(() => {
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);

	return {
		apr,
		...userStakeInfo,
	};
};
