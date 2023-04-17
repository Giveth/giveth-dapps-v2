import { useEffect, useRef, useState } from 'react';
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
import config from '@/configuration';

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
	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { library, chainId } = useWeb3React();
	const currentValues = useAppSelector(
		state =>
			poolStakingConfig.network === config.XDAI_NETWORK_NUMBER
				? state.subgraph.xDaiValues
				: state.subgraph.mainnetValues,
		() => (hold ? true : false),
	);

	const { network, type } = poolStakingConfig;
	const { isLoaded } = currentValues;
	const providerNetwork = library?.network?.chainId;
	const _library = chainId === network ? library : undefined;

	useEffect(() => {
		const cb = () => {
			if (isLoaded) {
				const promise: Promise<APR> =
					type === StakingType.GIV_LM
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

		stakePoolInfoPoll.current = setInterval(cb, 60000); // Every one minutes

		return () => {
			if (stakePoolInfoPoll.current) {
				clearInterval(stakePoolInfoPoll.current);
				stakePoolInfoPoll.current = null;
			}
		};
	}, [library, chainId, isLoaded, providerNetwork]);

	useEffect(() => {
		setUserStakeInfo(getUserStakeInfo(currentValues, poolStakingConfig));
	}, [currentValues, poolStakingConfig]);
	return {
		apr,
		...userStakeInfo,
	};
};
