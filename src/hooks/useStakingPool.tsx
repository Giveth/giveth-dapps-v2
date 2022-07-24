import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
import { Zero } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';

export interface IStakeInfo {
	apr: BigNumber | null;
	earned: ethers.BigNumber;
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
}

export const useStakingPool = (
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig,
	network: number,
): IStakeInfo => {
	const [apr, setApr] = useState<BigNumber | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: ethers.constants.Zero,
		notStakedAmount: ethers.constants.Zero,
		stakedAmount: ethers.constants.Zero,
	});
	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { library, chainId } = useWeb3React();
	const currentValues = useAppSelector(state => state.subgraph.currentValues);

	const { type, LM_ADDRESS } = poolStakingConfig;
	const subgraphIsLoaded = !!currentValues.isLoaded;
	const providerNetwork = library?.network?.chainId;

	useEffect(() => {
		const cb = () => {
			if (
				library &&
				chainId === network &&
				providerNetwork === network &&
				subgraphIsLoaded
			) {
				const promise: Promise<APR> =
					type === StakingType.GIV_LM
						? getGivStakingAPR(LM_ADDRESS, currentValues)
						: getLPStakingAPR(
								poolStakingConfig,
								network,
								library,
								currentValues,
						  );
				promise.then(setApr);
			} else {
				setApr(Zero);
			}
		};

		cb();

		stakePoolInfoPoll.current = setInterval(cb, 60000); // Every one minutes

		return () => {
			if (stakePoolInfoPoll.current) {
				clearInterval(stakePoolInfoPoll.current);
				stakePoolInfoPoll.current = null;
			}
		};
	}, [library, chainId, subgraphIsLoaded, providerNetwork]);

	useEffect(() => {
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);
	return {
		apr,
		...userStakeInfo,
	};
};
