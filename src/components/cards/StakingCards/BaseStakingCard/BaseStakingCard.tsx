import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Caption, IconAlertCircle32 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import {
	PoolStakingConfig,
	RegenFarmConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import {
	SPTitle,
	StakingPoolContainer,
	StakingPoolLabel,
	StakingPoolSubtitle,
	WrongNetworkContainer,
} from './BaseStakingCard.sc';

import { chainName } from '@/lib/constants/constants';
import config from '@/configuration';
import { IconAngelVault } from '@/components/Icons/AngelVault';
import { IconBalancer } from '@/components/Icons/Balancer';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGIV } from '@/components/Icons/GIV';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconHoneyswap } from '@/components/Icons/Honeyswap';
import { IconSushiswap } from '@/components/Icons/Sushiswap';
import { IconUniswap } from '@/components/Icons/Uniswap';
import { APRModal } from '@/components/modals/APR';
import { GIVPowerExplainModal } from '@/components/modals/GIVPowerExplain';
import { StakingPoolImages } from '@/components/StakingPoolImages';
import GIVpowerCardIntro from '../GIVpowerCard/GIVpowerCardIntro';
import StakingCardIntro from '../StakingCardIntro';
import { ArchiveCover } from './ArchiveCover';
import { StakingCardHeader } from './StakingCardHeader';
import Routes from '@/lib/constants/Routes';
import { getNowUnixMS } from '@/helpers/time';
import { StakingPoolInfoAndActions } from './StakingPoolInfoAndActions';
import { StakeModal } from '@/components/modals/StakeLock/Stake';
import { StakeGIVModal } from '@/components/modals/StakeLock/StakeGIV';
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
	regenStreamConfig?: RegenFarmConfig;
	stakedPositions?: LiquidityPosition[];
	unstakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	poolStakingConfig,
	notif,
	regenStreamConfig,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
}) => {
	const { formatMessage } = useIntl();
	const [state, setState] = useState(StakeCardState.NORMAL);
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showUniV3APRModal, setShowUniV3APRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [isFirstStakeShown, setIsFirstStakeShown] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showLockModal, setShowLockModal] = useState(false);
	const [showGIVPowerExplain, setShowGIVPowerExplain] = useState(false);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);

	const router = useRouter();

	const { chainId, account, active: isWalletActive } = useWeb3React();

	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;

	const {
		type,
		title,
		icon,
		description,
		provideLiquidityLink,
		unit,
		farmEndTimeMS,
		exploited,
		network: poolNetwork,
	} = poolStakingConfig;

	useEffect(() => {
		if (isFirstStakeShown || !router) return;
		const { open, chain } = router.query;
		const _open = Array.isArray(open) ? open[0] : open;
		const _chain = Array.isArray(chain) ? chain[0] : chain;
		const _chainId =
			_chain === 'gnosis'
				? config.XDAI_NETWORK_NUMBER
				: config.MAINNET_NETWORK_NUMBER;
		const checkNetworkAndShowStakeModal = async () => {
			if (
				_chainId === chainId &&
				_chainId === poolNetwork &&
				_open === type
			) {
				if (account) {
					setShowStakeModal(true);
					setIsFirstStakeShown(true);
					router.replace(Routes.GIVfarm, undefined, {
						shallow: true,
					});
				}
			}
		};
		checkNetworkAndShowStakeModal();
	}, [router, account, isWalletActive]);

	const isGIVStaking = type === StakingType.GIV_LM;
	const isGIVpower =
		isGIVStaking && poolNetwork === config.XDAI_NETWORK_NUMBER;

	const isDiscontinued = farmEndTimeMS
		? getNowUnixMS() > farmEndTimeMS
		: false;

	return (
		<>
			<StakingPoolContainer>
				{poolNetwork !== chainId && (
					<WrongNetworkContainer>
						<IconAlertCircle32 />
						<Caption>
							{formatMessage({
								id: 'label.you_are_currently_connected_to',
							})}{' '}
							{chainName(chainId || 0)}{' '}
							{formatMessage({ id: 'label.switch_to' })}{' '}
							{chainName(poolNetwork || 0)}{' '}
							{formatMessage({
								id: 'label.to_interact_with_this_farm',
							})}
						</Caption>
					</WrongNetworkContainer>
				)}
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
							regenStreamConfig={regenStreamConfig}
							isDiscontinued={isDiscontinued}
							isGIVpower={isGIVpower}
							setShowAPRModal={setShowAPRModal}
							setShowStakeModal={setShowStakeModal}
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
			{showAPRModal && (
				<APRModal
					setShowModal={setShowAPRModal}
					regenStreamConfig={regenStreamConfig}
					regenStreamType={regenStreamType}
					poolNetwork={poolNetwork}
				/>
			)}
			{/* {showUniV3APRModal && (
				<UniV3APRModal
					setShowModal={setShowUniV3APRModal}
					poolStakingConfig={poolStakingConfig}
				/>
			)} */}
			{showStakeModal &&
				(isGIVpower ? (
					<StakeGIVModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
						showLockModal={() => setShowLockModal(true)}
					/>
				) : (
					<StakeModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
						regenStreamConfig={regenStreamConfig}
					/>
				))}
			{/* {showUnStakeModal &&
				(type === StakingType.UNISWAPV3_ETH_GIV ? (
					<V3StakeModal
						isUnstakingModal={true}
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={poolStakingConfig}
						stakedPositions={stakedPositions || []}
						unstakedPositions={unstakedPositions || []}
						currentIncentive={
							currentIncentive || {
								key: undefined,
							}
						}
					/>
				) : (
					<UnStakeModal
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
						regenStreamConfig={regenStreamConfig}
						maxAmount={availableStakedToken}
					/>
				))} */}
			{/* {showHarvestModal && chainId && (
				<HarvestAllModal
					title={formatMessage({ id: 'label.givfarm_rewards' })}
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					earned={earned}
					network={chainId}
					tokenDistroHelper={tokenDistroHelper}
					regenStreamConfig={regenStreamConfig}
					stakedPositions={stakedPositions}
					currentIncentive={currentIncentive}
				/>
			)} */}
			{/* {showLockModal && (
				<LockModal
					setShowModal={setShowLockModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={availableStakedToken}
				/>
			)} */}
			{/* {showWhatIsGIVstreamModal && (
				<WhatisStreamModal
					setShowModal={setShowWhatIsGIVstreamModal}
					tokenDistroHelper={tokenDistroHelper}
					regenStreamConfig={regenStreamConfig}
				/>
			)} */}
			{/* {showLockDetailModal && (
				<LockupDetailsModal
					setShowModal={setShowLockDetailModal}
					unstakeable={availableStakedToken}
				/>
			)} */}
		</>
	);
};

export default BaseStakingCard;
