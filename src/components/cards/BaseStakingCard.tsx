import config from '../../configuration';
import Image from 'next/image';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import React, { FC, useEffect, useState, ReactNode, useMemo } from 'react';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	StakingPoolContainer,
	StakingPoolExchangeRow,
	SPTitle,
	StakingPoolLabel,
	StakingPoolSubtitle,
	Details,
	FirstDetail,
	Detail,
	DetailLabel,
	DetailValue,
	ClaimButton,
	StakeButton,
	StakingPoolExchange,
	StakePoolInfoContainer,
	DetailUnit,
	StakeButtonsRow,
	StakeContainer,
	StakeAmount,
	LiquidityButton,
	IconContainer,
	IconHelpWraper,
	GIVgardenTooltip,
	IntroIcon,
	DisableModal,
	DisableModalContent,
	DisableModalText,
	DisableModalCloseButton,
	DisableModalImage,
} from './BaseStakingCard.sc';
import {
	IconSpark,
	brandColors,
	IconHelp,
	IconExternalLink,
} from '@giveth/ui-design-system';
import { APRModal } from '../modals/APR';
import { StakeModal } from '../modals/Stake';
import { UnStakeModal } from '../modals/UnStake';
import { StakingPoolImages } from '../StakingPoolImages';
import { V3StakeModal } from '../modals/V3Stake';
import { IconGIV } from '../Icons/GIV';
import { IconHoneyswap } from '../Icons/Honeyswap';
import { IconBalancer } from '../Icons/Balancer';
import { IconUniswap } from '../Icons/Uniswap';
import { HarvestAllModal } from '../modals/HarvestAll';
import { useFarms } from '@/context/farm.context';
import { constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import BigNumber from 'bignumber.js';
import { WhatisStreamModal } from '../modals/WhatisStream';
import { IconSushiswap } from '../Icons/Sushiswap';
import { useWeb3React } from '@web3-react/core';
import { UniV3APRModal } from '../modals/UNIv3APR';
import StakingCardIntro from './StakingCardIntro';
import { getNowUnixMS } from '@/helpers/time';
import FarmCountDown from '../FarmCountDown';
import { Flex } from '../styled-components/Flex';

export enum StakeCardState {
	NORMAL,
	INTRO,
}

export const getPoolIconWithName = (pool: string) => {
	switch (pool) {
		case StakingType.BALANCER:
			return <IconBalancer size={16} />;
		case StakingType.GIV_LM:
			return <IconGIV size={16} />;
		case StakingType.HONEYSWAP:
			return <IconHoneyswap size={16} />;
		case StakingType.UNISWAPV2:
		case StakingType.UNISWAPV3:
			return <IconUniswap size={16} />;
		case StakingType.SUSHISWAP:
			return <IconSushiswap size={16} />;
		default:
			break;
	}
};
interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	stakeInfo: any;
	notif?: ReactNode;
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	stakeInfo,
	poolStakingConfig,
	notif,
}) => {
	const [state, setState] = useState(StakeCardState.NORMAL);
	const [started, setStarted] = useState(true);
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showUniV3APRModal, setShowUniV3APRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { getTokenDistroHelper } = useTokenDistro();
	const { setInfo } = useFarms();
	const { chainId } = useWeb3React();
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const tokenDistroHelper = useMemo(() => {
		return getTokenDistroHelper(regenStreamType);
	}, [getTokenDistroHelper, poolStakingConfig]);
	const [disableModal, setDisableModal] = useState<boolean>(true);

	const { type, title, description, provideLiquidityLink, BUY_LINK, unit } =
		poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAPV3;

	const { apr, earned, stakedLpAmount, userNotStakedAmount } = stakeInfo;

	const regenStreamConfig = useMemo(() => {
		if (!regenStreamType) return undefined;
		const networkConfig =
			chainId === config.XDAI_NETWORK_NUMBER
				? config.XDAI_CONFIG
				: config.MAINNET_CONFIG;
		return networkConfig.regenStreams.find(s => s.type === regenStreamType);
	}, [chainId, regenStreamType]);

	useEffect(() => {
		if (tokenDistroHelper) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(earned));
			setRewardStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(earned),
			);
		}
	}, [earned, tokenDistroHelper]);

	useEffect(() => {
		if (chainId) {
			if (!regenStreamConfig) setInfo(chainId, type, earned);
		}
	}, [chainId, earned, type, regenStreamConfig, setInfo]);

	const rewardTokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const { regenFarmStartTime, regenFarmIntro } =
		poolStakingConfig as RegenPoolStakingConfig;

	useEffect(() => {
		setStarted(
			regenFarmStartTime ? getNowUnixMS() > regenFarmStartTime : true,
		);
	}, [regenFarmStartTime]);

	return (
		<>
			<StakingPoolContainer>
				{isV3Staking && disableModal && (
					<DisableModal>
						<DisableModalContent>
							<DisableModalImage>
								<Image
									src='/images/icons/questionMarkGiv.svg'
									height={24}
									width={24}
								/>
							</DisableModalImage>
							<div>
								<DisableModalText weight={700}>
									This pool is no longer available
								</DisableModalText>
								<br />
								<DisableModalText>
									Please unstake your tokens and check out
									other available pools.
								</DisableModalText>
								<DisableModalCloseButton
									label='GOT IT'
									onClick={() => setDisableModal(false)}
								/>
							</div>
						</DisableModalContent>
					</DisableModal>
				)}
				{state === StakeCardState.NORMAL ? (
					<>
						<StakingPoolExchangeRow gap='4px' alignItems='center'>
							{getPoolIconWithName(type)}
							<StakingPoolExchange styleType='Small'>
								{type === StakingType.GIV_LM &&
									chainId === config.XDAI_NETWORK_NUMBER &&
									`GIVgarden `}
								{type}
							</StakingPoolExchange>
							{chainId === config.XDAI_NETWORK_NUMBER &&
								type === StakingType.GIV_LM && (
									<IconWithTooltip
										direction={'top'}
										icon={
											<IconHelp
												color={brandColors.deep[100]}
												size={12}
											/>
										}
									>
										<GIVgardenTooltip>
											While staking GIV in this pool you
											are also granted voting power (gGIV)
											in the GIVgarden.
										</GIVgardenTooltip>
									</IconWithTooltip>
								)}
							<div style={{ flex: 1 }}></div>
							{notif && notif}
							{regenFarmIntro && (
								<IntroIcon
									onClick={() =>
										setState(StakeCardState.INTRO)
									}
								>
									<IconHelp size={16} />
								</IntroIcon>
							)}
						</StakingPoolExchangeRow>
						<SPTitle alignItems='center' gap='16px'>
							<StakingPoolImages title={title} />
							<div>
								<StakingPoolLabel weight={900}>
									{title}
								</StakingPoolLabel>
								<StakingPoolSubtitle>
									{description}
								</StakingPoolSubtitle>
							</div>
						</SPTitle>
						<StakePoolInfoContainer>
							{started ? (
								<Details>
									<FirstDetail justifyContent='space-between'>
										<DetailLabel>APR</DetailLabel>
										<Flex gap='8px' alignItems='center'>
											{isV3Staking ? (
												<div>N/A %</div>
											) : (
												<>
													<IconSpark
														size={24}
														color={
															brandColors
																.mustard[500]
														}
													/>
													<DetailValue>
														{apr &&
															formatEthHelper(
																apr,
																2,
															)}
														%
													</DetailValue>
													<IconContainer
														onClick={() =>
															setShowAPRModal(
																true,
															)
														}
													>
														<IconHelp size={16} />
													</IconContainer>
												</>
											)}
										</Flex>
									</FirstDetail>
									<Detail justifyContent='space-between'>
										<DetailLabel>Claimable</DetailLabel>
										<DetailValue>
											{isV3Staking ? (
												<div>N/A</div>
											) : (
												`${formatWeiHelper(
													rewardLiquidPart,
												)} ${rewardTokenSymbol}`
											)}
										</DetailValue>
									</Detail>
									<Detail justifyContent='space-between'>
										<Flex gap='8px' alignItems='center'>
											<DetailLabel>Streaming</DetailLabel>
											<IconHelpWraper
												onClick={() => {
													setShowWhatIsGIVstreamModal(
														true,
													);
												}}
											>
												<IconHelp size={16} />
											</IconHelpWraper>
										</Flex>
										<Flex gap='4px' alignItems='center'>
											<DetailValue>
												{isV3Staking ? (
													<div>N/A</div>
												) : (
													formatWeiHelper(
														rewardStream,
													)
												)}
											</DetailValue>
											<DetailUnit>
												{rewardTokenSymbol}/week
											</DetailUnit>
										</Flex>
									</Detail>
								</Details>
							) : (
								<FarmCountDown
									startTime={regenFarmStartTime || 0}
									setStarted={setStarted}
								/>
							)}
							<ClaimButton
								disabled={earned.isZero() || isV3Staking}
								onClick={() => setShowHarvestModal(true)}
								label='HARVEST REWARDS'
								buttonType='primary'
							/>
							<StakeButtonsRow>
								<StakeContainer flexDirection='column'>
									<StakeButton
										label='STAKE'
										size='small'
										disabled={
											userNotStakedAmount.isZero() ||
											isV3Staking
										}
										onClick={() => setShowStakeModal(true)}
									/>
									<StakeAmount>
										{isV3Staking
											? `${userNotStakedAmount.toNumber()} ${unit}`
											: `${formatWeiHelper(
													userNotStakedAmount,
											  )} ${unit}`}
									</StakeAmount>
								</StakeContainer>
								<StakeContainer flexDirection='column'>
									<StakeButton
										label='UNSTAKE'
										size='small'
										disabled={stakedLpAmount.isZero()}
										onClick={() =>
											setShowUnStakeModal(true)
										}
									/>
									<StakeAmount>
										{isV3Staking
											? `${stakedLpAmount.toNumber()} ${unit}`
											: `${formatWeiHelper(
													stakedLpAmount,
											  )} ${unit}`}
									</StakeAmount>
								</StakeContainer>
							</StakeButtonsRow>
							{!isV3Staking && (
								<LiquidityButton
									label={
										type === StakingType.GIV_LM
											? 'BUY GIV TOKENS'
											: 'PROVIDE LIQUIDITY'
									}
									onClick={() => {
										if (isV3Staking) {
											setShowUniV3APRModal(true);
										} else {
											window.open(
												type === StakingType.GIV_LM
													? BUY_LINK
													: provideLiquidityLink,
											);
										}
									}}
									buttonType='texty'
									icon={
										<IconExternalLink
											size={16}
											color={brandColors.deep[100]}
										/>
									}
								/>
							)}
						</StakePoolInfoContainer>
					</>
				) : (
					<StakingCardIntro
						poolStakingConfig={
							poolStakingConfig as RegenPoolStakingConfig
						}
						setState={setState}
					/>
				)}
			</StakingPoolContainer>
			{showAPRModal && (
				<APRModal
					setShowModal={setShowAPRModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={userNotStakedAmount}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
			{showUniV3APRModal && (
				<UniV3APRModal
					setShowModal={setShowUniV3APRModal}
					poolStakingConfig={poolStakingConfig}
				/>
			)}
			{showStakeModal &&
				(isV3Staking ? (
					<V3StakeModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={poolStakingConfig}
					/>
				) : (
					<StakeModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={poolStakingConfig}
						maxAmount={userNotStakedAmount}
					/>
				))}
			{showUnStakeModal &&
				(isV3Staking ? (
					<V3StakeModal
						isUnstakingModal={true}
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={poolStakingConfig}
					/>
				) : (
					<UnStakeModal
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={poolStakingConfig}
						maxAmount={stakedLpAmount}
					/>
				))}
			{showHarvestModal && chainId && (
				<HarvestAllModal
					title='GIVfarm Rewards'
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					earned={earned}
					network={chainId}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
			{showWhatIsGIVstreamModal && (
				<WhatisStreamModal
					setShowModal={setShowWhatIsGIVstreamModal}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
		</>
	);
};

export default BaseStakingCard;
