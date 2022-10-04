import BaseStakingCard from './BaseStakingCard';
import { useGIVpower } from '@/context/givpower.context';

import type { FC } from 'react';

interface IGIVpowerStakingPoolCardProps {}

const GIVpowerStakingPoolCard: FC<IGIVpowerStakingPoolCardProps> = ({}) => {
	const { poolStakingConfig, apr, notStakedAmount, stakedAmount, earned } =
		useGIVpower();
	const stakeInfo = {
		apr,
		notStakedAmount,
		earned,
		stakedAmount,
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default GIVpowerStakingPoolCard;
