import React, { FC, ReactNode, useState } from 'react';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import {
	SPTitle,
	StakingPoolContainer,
	StakingPoolLabel,
	StakingPoolSubtitle,
} from './BaseStakingCard.sc';

import config from '@/configuration';
import { GIVPowerExplainModal } from '@/components/modals/GIVPowerExplain';
import { StakingPoolImages } from '@/components/StakingPoolImages';
import GIVpowerCardIntro from '../GIVpowerCard/GIVpowerCardIntro';
import StakingCardIntro from '../StakingCardIntro';
import { StakingCardHeader } from './StakingCardHeader';
import { getNowUnixMS } from '@/helpers/time';
import { StakingPoolInfoAndActions } from './StakingPoolInfoAndActions';
import { ArchiveAndNetworkCover } from '@/components/ArchiveAndNetworkCover/ArchiveAndNetworkCover';
import type { LiquidityPosition } from '@/types/nfts';

export enum StakeCardState {
	NORMAL,
	INTRO,
	GIVPOWER_INTRO,
}

interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	notif?: ReactNode;
	stakedPositions?: LiquidityPosition[];
	unstakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	poolStakingConfig,
	notif,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
}) => {
	const [state, setState] = useState(StakeCardState.NORMAL);
	const [showGIVPowerExplain, setShowGIVPowerExplain] = useState(false);

	const {
		type,
		title,
		icon,
		description,
		farmEndTimeMS,
		exploited,
		network: poolNetwork,
	} = poolStakingConfig;

	const isGIVStaking = type === StakingType.GIV_LM;
	const isGIVpower =
		isGIVStaking && poolNetwork === config.XDAI_NETWORK_NUMBER;

	const isDiscontinued = farmEndTimeMS
		? getNowUnixMS() > farmEndTimeMS
		: false;

	return (
		<>
			<StakingPoolContainer>
				{state === StakeCardState.NORMAL ? (
					<>
						<StakingCardHeader
							setState={setState}
							poolStakingConfig={poolStakingConfig}
							isGIVpower={isGIVpower}
							notif={notif}
						/>
						<SPTitle alignItems='center' gap='16px'>
							<StakingPoolImages title={title} icon={icon} />
							<div>
								<StakingPoolLabel weight={900}>
									{title}
								</StakingPoolLabel>
								<StakingPoolSubtitle>
									{description}
								</StakingPoolSubtitle>
							</div>
						</SPTitle>
						<StakingPoolInfoAndActions
							poolStakingConfig={poolStakingConfig}
							isDiscontinued={isDiscontinued}
							isGIVpower={isGIVpower}
							stakedPositions={stakedPositions}
							unstakedPositions={unstakedPositions}
							currentIncentive={currentIncentive}
						/>
					</>
				) : state === StakeCardState.GIVPOWER_INTRO ? (
					<GIVpowerCardIntro setState={setState} />
				) : (
					<StakingCardIntro
						symbol={title}
						introCard={poolStakingConfig.introCard}
						setState={setState}
					/>
				)}
				<ArchiveAndNetworkCover
					targetNetwork={poolNetwork}
					isArchived={isDiscontinued}
					isExploited={exploited}
				/>
			</StakingPoolContainer>
			{showGIVPowerExplain && (
				<GIVPowerExplainModal setShowModal={setShowGIVPowerExplain} />
			)}
		</>
	);
};

export default BaseStakingCard;
