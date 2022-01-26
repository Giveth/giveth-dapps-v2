import React, { FC, useContext } from 'react';

import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useStakingPool } from '@/hooks/useStakingPool';
interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { apr, notStakedAmount, stakedAmount, earned } = useStakingPool(
		poolStakingConfig,
		network,
	);

	const stakeInfo = {
		apr: apr,
		userNotStakedAmount: notStakedAmount,
		earned: earned,
		stakedLpAmount: stakedAmount,
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPoolCard;
