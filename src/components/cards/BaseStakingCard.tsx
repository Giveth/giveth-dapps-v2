import Image from 'next/image';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import {
	brandColors,
	IconExternalLink,
	IconHelp,
	IconSpark,
} from '@giveth/ui-design-system';
import { constants } from 'ethers';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import config from '../../configuration';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import { BN, formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	ClaimButton,
	Detail,
	DetailLabel,
	Details,
	DetailUnit,
	DetailValue,
	DisableModal,
	DisableModalCloseButton,
	DisableModalContent,
	DisableModalImage,
	DisableModalText,
	FirstDetail,
	IconContainer,
	IconHelpWraper,
	IntroIcon,
	LiquidityButton,
	LockInfotooltip,
	SPTitle,
	StakeAmount,
	StakeButton,
	StakeButtonsRow,
	StakeContainer,
	StakePoolInfoContainer,
	StakingPoolContainer,
	StakingPoolExchange,
	StakingPoolExchangeRow,
	StakingPoolLabel,
	StakingPoolSubtitle,
} from './BaseStakingCard.sc';
import { APRModal } from '../modals/APR';
import { StakeModal } from '../modals/StakeLock/Stake';
import { UnStakeModal } from '../modals/Unstake/UnStake';
import { StakingPoolImages } from '../StakingPoolImages';
import { V3StakeModal } from '../modals/V3Stake';
import { IconGIV } from '../Icons/GIV';
import { IconHoneyswap } from '../Icons/Honeyswap';
import { IconBalancer } from '../Icons/Balancer';
import { IconUniswap } from '../Icons/Uniswap';
import { HarvestAllModal } from '../modals/HarvestAll';
import { useFarms } from '@/context/farm.context';
import { WhatisStreamModal } from '../modals/WhatisStream';
import { IconSushiswap } from '../Icons/Sushiswap';
import { UniV3APRModal } from '../modals/UNIv3APR';
import StakingCardIntro from './StakingCardIntro';
import { getNowUnixMS } from '@/helpers/time';
import FarmCountDown from '../FarmCountDown';
import { Flex } from '../styled-components/Flex';
import { IStakeInfo } from '@/hooks/useStakingPool';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { GIVPowerExplainModal } from '../modals/GIVPowerExplain';
import GIVpowerCardIntro from './GIVpowerCardIntro';
import LockModal from '../modals/StakeLock/Lock';
import { StakeGIVModal } from '../modals/StakeLock/StakeGIV';
import { avgAPR } from '@/helpers/givpower';
import { LockupDetailsModal } from '../modals/LockupDetailsModal';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import Routes from '@/lib/constants/Routes';
import { IconAngelVault } from '../Icons/AngelVault';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import type { LiquidityPosition } from '@/types/nfts';

export enum StakeCardState {
	NORMAL,
	INTRO,
	GIVPOWER_INTRO,
}

export const getPoolIconWithName = (platform: StakingPlatform) => {
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
	stakeInfo: IStakeInfo;
	notif?: ReactNode;
	stakedPositions?: LiquidityPosition[];
	unstakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	stakeInfo,
	poolStakingConfig,
	notif,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
}) => {
	const [state, setState] = useState(StakeCardState.NORMAL);
	const [started, setStarted] = useState(true);
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
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [tokenDistroHelper, setTokenDistroHelper] =
		useState<TokenDistroHelper>();
	const [disableModal, setDisableModal] = useState<boolean>(true);
	const router = useRouter();
	const { setInfo } = useFarms();
	const { chainId, account, active: isWalletActive } = useWeb3React();
	const currentValues = useAppSelector(state => state.subgraph.currentValues);

	const sdh = new SubgraphDataHelper(currentValues);
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;

	const {
		type,
		platform,
		platformTitle,
		title,
		icon,
		description,
		provideLiquidityLink,
		unit,
		farmStartTimeMS,
		active,
		archived,
		introCard,
	} = poolStakingConfig;

	const {
		apr,
		earned,
		stakedAmount: stakedLpAmount,
		notStakedAmount: userNotStakedAmount,
	} = stakeInfo;

	const userGIVLocked = sdh.getUserGIVLockedBalance();
	const userGIVPowerBalance = sdh.getUserGIVPowerBalance();

	const regenStreamConfig = useMemo(() => {
		if (!regenStreamType) return undefined;
		const networkConfig =
			chainId === config.XDAI_NETWORK_NUMBER
				? config.XDAI_CONFIG
				: config.MAINNET_CONFIG;
		return networkConfig.regenStreams.find(s => s.type === regenStreamType);
	}, [chainId, regenStreamType]);

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
			if (_chainId === chainId && _open === type) {
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

	useEffect(() => {
		if (regenStreamType) {
			setTokenDistroHelper(
				new TokenDistroHelper(
					sdh.getTokenDistro(
						regenStreamConfig?.tokenDistroAddress as string,
					),
				),
			);
		} else {
			setTokenDistroHelper(
				new TokenDistroHelper(sdh.getGIVTokenDistro()),
			);
		}
	}, [currentValues, poolStakingConfig, regenStreamConfig]);

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

	useEffect(() => {
		setStarted(farmStartTimeMS ? getNowUnixMS() > farmStartTimeMS : true);
	}, [farmStartTimeMS]);

	const isGIVpower =
		type === StakingType.GIV_LM && chainId === config.XDAI_NETWORK_NUMBER;
	const isLocked = isGIVpower && userGIVLocked.balance !== '0';
	const isZeroGIVStacked = isGIVpower && userGIVPowerBalance.balance === '0';
	return (
		<>
			<StakingPoolContainer
				big={isGIVpower}
				shadowColor={isGIVpower ? '#E1458D' : ''}
			>
				{(!active || archived) && disableModal && (
					<DisableModal>
						<DisableModalContent>
							<DisableModalImage>
								<Image
									src='/images/icons/questionMarkGiv.svg'
									height={24}
									width={24}
									alt='question'
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
							{getPoolIconWithName(platform)}
							<StakingPoolExchange styleType='Small'>
								{isGIVpower
									? 'GIVPOWER'
									: platformTitle || platform}
							</StakingPoolExchange>
							<div style={{ flex: 1 }}></div>
							{notif && notif}
							{introCard && (
								<IntroIcon
									onClick={() =>
										setState(StakeCardState.INTRO)
									}
								>
									<IconHelp size={16} />
								</IntroIcon>
							)}
							{isGIVpower && (
								<IntroIcon
									onClick={() =>
										setState(StakeCardState.GIVPOWER_INTRO)
									}
								>
									<IconHelp size={16} />
								</IntroIcon>
							)}
						</StakingPoolExchangeRow>
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
						<StakePoolInfoContainer>
							{started ? (
								<Details>
									<FirstDetail justifyContent='space-between'>
										<DetailLabel>APR</DetailLabel>
										<Flex gap='8px' alignItems='center'>
											{active && !archived ? (
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
																isLocked
																	? avgAPR(
																			apr.effectiveAPR,
																			userGIVLocked.balance,
																			userGIVPowerBalance.balance,
																	  )
																	: apr.effectiveAPR,
																2,
															)}
														%
														{isZeroGIVStacked &&
															`-${
																apr &&
																formatEthHelper(
																	apr.effectiveAPR.multipliedBy(
																		5.2, // sqrt(1 + max rounds)
																	),
																	2,
																)
															}%`}
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
											) : (
												<div>N/A %</div>
											)}
										</Flex>
									</FirstDetail>
									<Detail justifyContent='space-between'>
										<DetailLabel>Claimable</DetailLabel>
										<DetailValue>
											{active ? (
												`${formatWeiHelper(
													rewardLiquidPart,
												)} ${rewardTokenSymbol}`
											) : (
												<div>N/A</div>
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
												{active ? (
													formatWeiHelper(
														rewardStream,
													)
												) : (
													<div>N/A</div>
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
									startTime={farmStartTimeMS || 0}
									setStarted={setStarted}
								/>
							)}
							<ClaimButton
								disabled={!active || earned.isZero()}
								onClick={() => setShowHarvestModal(true)}
								label='HARVEST REWARDS'
								buttonType={
									isGIVpower ? 'secondary' : 'primary'
								}
							/>
							{isGIVpower && (
								<ClaimButton
									disabled={!active || earned.isZero()}
									onClick={() => setShowLockModal(true)}
									label='Increase your reward'
									buttonType='primary'
								/>
							)}
							<StakeButtonsRow>
								<StakeContainer flexDirection='column'>
									<StakeButton
										label='STAKE'
										size='small'
										disabled={
											!active ||
											archived ||
											BN(userNotStakedAmount).isZero()
										}
										onClick={() => setShowStakeModal(true)}
									/>
									<StakeAmount>
										{type === StakingType.UNISWAPV3_ETH_GIV
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
									<StakeAmount gap='5px'>
										{type === StakingType.UNISWAPV3_ETH_GIV
											? `${stakedLpAmount.toNumber()} ${unit}`
											: `${formatWeiHelper(
													stakedLpAmount,
											  )} ${unit}`}
										{isLocked && (
											<IconWithTooltip
												icon={<IconHelp size={16} />}
												direction={'right'}
												align={'right'}
											>
												<LockInfotooltip>
													Some or all of your staked
													GIV is locked. Click
													&ldquo;Locked GIV
													details&rdquo; for more
													information.
												</LockInfotooltip>
											</IconWithTooltip>
										)}
									</StakeAmount>
								</StakeContainer>
							</StakeButtonsRow>
							{active &&
								!archived &&
								(!isGIVpower ? (
									<Flex>
										<LiquidityButton
											label='PROVIDE LIQUIDITY'
											onClick={() => {
												if (
													type ===
													StakingType.UNISWAPV3_ETH_GIV
												) {
													setShowUniV3APRModal(true);
												} else {
													window.open(
														provideLiquidityLink,
													);
												}
											}}
											buttonType='texty'
											icon={
												<IconExternalLink
													size={16}
													color={
														brandColors.deep[100]
													}
												/>
											}
										/>
									</Flex>
								) : (
									<ClaimButton
										buttonType='texty'
										size='small'
										label='Locked GIV tokens'
										disabled={!isLocked}
										onClick={() => {
											setShowLockDetailModal(true);
										}}
									/>
								))}
						</StakePoolInfoContainer>
					</>
				) : state === StakeCardState.GIVPOWER_INTRO ? (
					<GIVpowerCardIntro setState={setState} />
				) : (
					<StakingCardIntro
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
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
					tokenDistroHelper={tokenDistroHelper}
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
				(type === StakingType.UNISWAPV3_ETH_GIV ? (
					<V3StakeModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={poolStakingConfig}
						stakedPositions={stakedPositions || []}
						unstakedPositions={unstakedPositions || []}
						currentIncentive={
							currentIncentive || {
								key: undefined,
							}
						}
					/>
				) : isGIVpower ? (
					<StakeGIVModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
						maxAmount={userNotStakedAmount}
						showLockModal={() => setShowLockModal(true)}
					/>
				) : (
					<StakeModal
						setShowModal={setShowStakeModal}
						poolStakingConfig={
							poolStakingConfig as SimplePoolStakingConfig
						}
						regenStreamConfig={regenStreamConfig}
						maxAmount={userNotStakedAmount}
					/>
				))}
			{showUnStakeModal &&
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
						maxAmount={stakedLpAmount.sub(userGIVLocked.balance)}
					/>
				))}
			{showHarvestModal && chainId && (
				<HarvestAllModal
					title='GIVfarm Rewards'
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					earned={earned}
					network={chainId}
					tokenDistroHelper={tokenDistroHelper}
					regenStreamConfig={regenStreamConfig}
					stakedPositions={stakedPositions}
					currentIncentive={currentIncentive}
				/>
			)}
			{showLockModal && (
				<LockModal
					setShowModal={setShowLockModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={stakedLpAmount.sub(userGIVLocked.balance)}
				/>
			)}
			{showWhatIsGIVstreamModal && (
				<WhatisStreamModal
					setShowModal={setShowWhatIsGIVstreamModal}
					tokenDistroHelper={tokenDistroHelper}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
			{showLockDetailModal && (
				<LockupDetailsModal
					setShowModal={setShowLockDetailModal}
					unstakeable={stakedLpAmount.sub(userGIVLocked.balance)}
				/>
			)}
		</>
	);
};

export default BaseStakingCard;
