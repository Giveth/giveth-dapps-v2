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

import { GIVPowerExplainModal } from '@/components/modals/GIVPowerExplain';
import { StakingPoolImages } from '@/components/StakingPoolImages';
import GIVpowerCardIntro from '../GIVpowerCard/GIVpowerCardIntro';
import StakingCardIntro from '../StakingCardIntro';
import { StakingCardHeader } from './StakingCardHeader';
import { getNowUnixMS } from '@/helpers/time';
import { StakingPoolInfoAndActions } from './StakingPoolInfoAndActions';
import { ArchiveAndNetworkCover } from '@/components/ArchiveAndNetworkCover/ArchiveAndNetworkCover';

export enum StakeCardState {
	NORMAL,
	INTRO,
	GIVPOWER_INTRO,
}

interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	notif?: ReactNode;
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	poolStakingConfig,
	notif,
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

	const isGIVpower =
		type === StakingType.GIV_GARDEN_LM ||
		type === StakingType.GIV_UNIPOOL_LM;

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
						<SPTitle $alignItems='center' gap='16px'>
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
							currentIncentive={currentIncentive}
						/>
					</>
				) : state === StakeCardState.GIVPOWER_INTRO ? (
					<GIVpowerCardIntro
						poolNetwork={poolNetwork}
						setState={setState}
					/>
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
