import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
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
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { Zero } from '@/helpers/number';
import { RootState } from '@/stores/store';

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
	const currentValues = useSelector(
		(state: RootState) => state.subgraph.currentValues,
	);

	const { balances } = currentValues;
	const { type, LM_ADDRESS, regenFarmType } =
		poolStakingConfig as RegenPoolStakingConfig;
	const unipool = currentValues[regenFarmType || type];
	const unipoolIsDefined = !!unipool;
	const providerNetwork = library?.network?.chainId;

	useEffect(() => {
		const cb = () => {
			if (
				library &&
				chainId === network &&
				providerNetwork === network &&
				unipoolIsDefined
			) {
				const unipoolHelper = unipool && new UnipoolHelper(unipool);
				const promise: Promise<APR> =
					type === StakingType.GIV_LM
						? getGivStakingAPR(LM_ADDRESS, network, unipoolHelper)
						: getLPStakingAPR(
								poolStakingConfig,
								network,
								library,
								unipoolHelper,
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
	}, [library, chainId, unipoolIsDefined, providerNetwork]);

	useEffect(() => {
		const unipoolHelper = unipool && new UnipoolHelper(unipool);
		setUserStakeInfo(
			getUserStakeInfo(type, regenFarmType, balances, unipoolHelper),
		);
	}, [type, regenFarmType, balances, unipool]);
	return {
		apr,
		...userStakeInfo,
	};
};
