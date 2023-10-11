import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { useAppSelector } from '@/features/hooks';
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
	const { chain } = useNetwork();
	const chainId = chain?.id;

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
				const promise: Promise<APR> =
					type === StakingType.GIV_GARDEN_LM ||
						type === StakingType.GIV_UNIPOOL_LM
						? getGivStakingAPR(network, currentValues, network)
						: getLPStakingAPR(poolStakingConfig, currentValues);
				promise
					.then(setApr)
					.catch(() => setApr({ effectiveAPR: Zero }));
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
	}, [chainId, isLoaded]);

	useEffect(() => {
		console.log('Calculating user stake info');
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);

	return {
		apr,
		...userStakeInfo,
	};
};
