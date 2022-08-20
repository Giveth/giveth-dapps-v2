import React, { FC } from 'react';

import BaseStakingCard from './BaseStakingCard';
import {
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import { useStakingPool } from '@/hooks/useStakingPool';

interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig;
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
		notStakedAmount: notStakedAmount,
		earned: earned,
		stakedAmount: stakedAmount,
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPoolCard;
