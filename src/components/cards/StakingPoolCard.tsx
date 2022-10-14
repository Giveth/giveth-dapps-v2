import BaseStakingCard from './BaseStakingCard';
import { useStakingPool } from '@/hooks/useStakingPool';
import type {
	RegenFarmConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import type { FC } from 'react';
interface IStakingPoolCardProps {
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig;
	regenStreamConfig?: RegenFarmConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	poolStakingConfig,
	regenStreamConfig,
}) => {
	const { apr, notStakedAmount, stakedAmount, earned } =
		useStakingPool(poolStakingConfig);
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
			regenStreamConfig={regenStreamConfig}
		/>
	);
};

export default StakingPoolCard;
