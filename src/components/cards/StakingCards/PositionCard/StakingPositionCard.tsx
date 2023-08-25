import { FC, useState, useEffect } from 'react';
import { SublineBold } from '@giveth/ui-design-system';
import { PoolStakingConfig } from '@/types/config';
import { useLiquidityPositions } from '@/hooks/useLiquidityPositions';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { YellowDot } from './PositionCard';
import BaseStakingCard from '../BaseStakingCard/BaseStakingCard';
import {
	OutOfRangeBadgeContianer,
	OutOfRangeTooltip,
} from '../BaseStakingCard/BaseStakingCard.sc';

const OutOfRangeBadge = () => (
	<OutOfRangeBadgeContianer alignItems='center'>
		<YellowDot />
		<SublineBold>Out of Range</SublineBold>
	</OutOfRangeBadgeContianer>
);

interface IStakingPositionCardProps {
	poolStakingConfig: PoolStakingConfig;
}

const StakingPositionCard: FC<IStakingPositionCardProps> = ({
	poolStakingConfig,
}) => {
	const { unstakedPositions, stakedPositions, currentIncentive } =
		useLiquidityPositions();
	const [oneOfPositionsOutOfRange, setOneOfPositionsOutOfRange] =
		useState(false);

	useEffect(() => {
		const _oneOfPositionsOutOfRange = stakedPositions.some(
			stakedPosition => {
				const { pool, tickLower, tickUpper } =
					stakedPosition._position || {};
				// Check price range
				const below =
					pool && typeof tickLower === 'number'
						? pool.tickCurrent < tickLower
						: undefined;
				const above =
					pool && typeof tickUpper === 'number'
						? pool.tickCurrent >= tickUpper
						: undefined;
				return below || above;
			},
		);
		setOneOfPositionsOutOfRange(_oneOfPositionsOutOfRange);
	}, [stakedPositions]);

	return (
		<BaseStakingCard
			poolStakingConfig={poolStakingConfig}
			stakedPositions={stakedPositions}
			unstakedPositions={unstakedPositions}
			currentIncentive={currentIncentive}
			notif={
				oneOfPositionsOutOfRange && (
					<IconWithTooltip
						icon={<OutOfRangeBadge />}
						direction={'top'}
					>
						<OutOfRangeTooltip>
							One or more of your position(s) are out of range and
							not earning rewards. Please unstake and make a new
							position.
						</OutOfRangeTooltip>
					</IconWithTooltip>
				)
			}
		/>
	);
};

export default StakingPositionCard;
