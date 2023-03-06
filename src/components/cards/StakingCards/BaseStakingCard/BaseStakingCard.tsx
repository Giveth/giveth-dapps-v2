import React, { FC, ReactNode, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import {
	SPTitle,
	StakingPoolContainer,
	StakingPoolLabel,
	StakingPoolSubtitle,
} from './BaseStakingCard.sc';

import config from '@/configuration';
import { IconAngelVault } from '@/components/Icons/AngelVault';
import { IconBalancer } from '@/components/Icons/Balancer';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGIV } from '@/components/Icons/GIV';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconHoneyswap } from '@/components/Icons/Honeyswap';
import { IconSushiswap } from '@/components/Icons/Sushiswap';
import { IconUniswap } from '@/components/Icons/Uniswap';
import { GIVPowerExplainModal } from '@/components/modals/GIVPowerExplain';
import { StakingPoolImages } from '@/components/StakingPoolImages';
import GIVpowerCardIntro from '../GIVpowerCard/GIVpowerCardIntro';
import StakingCardIntro from '../StakingCardIntro';
import { ArchiveCover } from './ArchiveCover';
import { StakingCardHeader } from './StakingCardHeader';
import { getNowUnixMS } from '@/helpers/time';
import { StakingPoolInfoAndActions } from './StakingPoolInfoAndActions';
import { WrongNetworkCover } from '@/components/WrongNetworkCover';
import type { LiquidityPosition } from '@/types/nfts';

export enum StakeCardState {
	NORMAL,
	INTRO,
	GIVPOWER_INTRO,
}

export const getPoolIconWithName = (
	platform: StakingPlatform,
	poolNetwork?: number,
) => {
	switch (poolNetwork) {
		case config.MAINNET_NETWORK_NUMBER:
			return <IconEthereum size={16} />;
		case config.XDAI_NETWORK_NUMBER:
			return <IconGnosisChain size={16} />;
	}
	// if no number is set then it defaults to platform icon
	switch (platform) {
		case StakingPlatform.BALANCER:
			return <IconBalancer size={16} />;
		case StakingPlatform.GIVETH:
			return <IconGIV size={16} />;
		case StakingPlatform.HONEYSWAP:
			return <IconHoneyswap size={16} />;
		case StakingPlatform.UNISWAP:
			return <IconUniswap size={16} />;
		case StakingPlatform.SUSHISWAP:
			return <IconSushiswap size={16} />;
		case StakingPlatform.ICHI:
			return <IconAngelVault size={16} />;
		default:
			break;
	}
};
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
	const { formatMessage } = useIntl();
	const [state, setState] = useState(StakeCardState.NORMAL);
	const [showGIVPowerExplain, setShowGIVPowerExplain] = useState(false);

	const { chainId } = useWeb3React();

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
				<WrongNetworkCover poolNetwork={poolNetwork} />
				{(isDiscontinued || exploited) && (
					<ArchiveCover isExploited={exploited} />
				)}
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
			</StakingPoolContainer>
			{showGIVPowerExplain && (
				<GIVPowerExplainModal setShowModal={setShowGIVPowerExplain} />
			)}
		</>
	);
};

export default BaseStakingCard;
