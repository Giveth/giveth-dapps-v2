import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { Zero } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';

export interface IStakeInfo {
	apr: APR;
	earned: ethers.BigNumber;
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
}

export const useStakingPool = (
	poolStakingConfig: SimplePoolStakingConfig,
	hold: boolean = false,
): IStakeInfo => {
	const [apr, setApr] = useState<APR | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: ethers.constants.Zero,
		notStakedAmount: ethers.constants.Zero,
		stakedAmount: ethers.constants.Zero,
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
						: getLPStakingAPR(
								poolStakingConfig,
								_library,
								currentValues,
						  );
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
