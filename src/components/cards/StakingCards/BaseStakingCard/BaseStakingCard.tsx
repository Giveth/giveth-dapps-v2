import React, { FC, ReactNode, useEffect, useState } from 'react';
import {
	brandColors,
	IconExternalLink,
	IconHelpFilled,
	IconSpark,
	Caption,
	IconAlertCircle32,
	IconHelpFilled16,
	IconInfoFilled24,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { constants } from 'ethers';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import {
	PoolStakingConfig,
	RegenFarmConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import { BN, formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	AngelVaultTooltip,
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
	DisableModalLink,
	DisableModalText,
	FirstDetail,
	GIVgardenTooltip,
	HarvestButtonsWrapper,
	IconContainer,
	IconHelpFilledWraper,
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
	WrongNetworkContainer,
} from './BaseStakingCard.sc';

import {
	Flex,
	FlexCenter,
	FlexSpacer,
} from '@/components/styled-components/Flex';
import { IStakeInfo } from '@/hooks/useStakingPool';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';
import { chainName } from '@/lib/constants/constants';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { avgAPR } from '@/helpers/givpower';
import config from '@/configuration';
import FarmCountDown from '@/components/FarmCountDown';
import { IconAngelVault } from '@/components/Icons/AngelVault';
import { IconBalancer } from '@/components/Icons/Balancer';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGIV } from '@/components/Icons/GIV';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconHoneyswap } from '@/components/Icons/Honeyswap';
import { IconSushiswap } from '@/components/Icons/Sushiswap';
import { IconUniswap } from '@/components/Icons/Uniswap';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { APRModal } from '@/components/modals/APR';
import { BridgeGIVModal } from '@/components/modals/BridgeGIV';
import { GIVPowerExplainModal } from '@/components/modals/GIVPowerExplain';
import { HarvestAllModal } from '@/components/modals/HarvestAll';
import { LockupDetailsModal } from '@/components/modals/LockupDetailsModal';
import LockModal from '@/components/modals/StakeLock/Lock';
import { StakeModal } from '@/components/modals/StakeLock/Stake';
import { StakeGIVModal } from '@/components/modals/StakeLock/StakeGIV';
import { UniV3APRModal } from '@/components/modals/UNIv3APR';
import { UnStakeModal } from '@/components/modals/Unstake/UnStake';
import { V3StakeModal } from '@/components/modals/V3Stake';
import { WhatisStreamModal } from '@/components/modals/WhatisStream';
import { StakingPoolImages } from '@/components/StakingPoolImages';
import { useFarms } from '@/context/farm.context';
import { getNowUnixMS } from '@/helpers/time';
import GIVpowerCardIntro from '../GIVpowerCard/GIVpowerCardIntro';
import StakingCardIntro from '../StakingCardIntro';
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
	stakeInfo: IStakeInfo;
	notif?: ReactNode;
	regenStreamConfig?: RegenFarmConfig;
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
	regenStreamConfig,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
}) => {
	const { formatMessage } = useIntl();
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
	const { mainnetValues, xDaiValues } = useAppSelector(
		state => state.subgraph,
	);

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
		farmEndTimeMS,
		exploited,
		introCard,
		network: poolNetwork,
	} = poolStakingConfig;

	const currentValues =
		poolNetwork === config.XDAI_NETWORK_NUMBER ? xDaiValues : mainnetValues;
	const sdh = new SubgraphDataHelper(currentValues);

	const {
		apr,
		earned,
		stakedAmount: stakedLpAmount,
		notStakedAmount: userNotStakedAmount,
	} = stakeInfo;

	const userGIVLocked = sdh.getUserGIVLockedBalance();
	const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
	const isDiscontinued = farmEndTimeMS
		? getNowUnixMS() > farmEndTimeMS
		: false;

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
		if (!(exploited || regenStreamConfig))
			setInfo(poolNetwork, type, earned);
	}, [poolNetwork, earned, type, regenStreamConfig, setInfo]);

	const rewardTokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';

	useEffect(() => {
		setStarted(farmStartTimeMS ? getNowUnixMS() > farmStartTimeMS : true);
	}, [farmStartTimeMS]);

	const isGIVStaking = type === StakingType.GIV_LM;
	const isBridge =
		isGIVStaking && poolNetwork === config.MAINNET_NETWORK_NUMBER;
	const isGIVpower =
		isGIVStaking && poolNetwork === config.XDAI_NETWORK_NUMBER;
	const isLocked = isGIVpower && userGIVLocked.balance !== '0';
	const isZeroGIVStacked =
		isGIVpower && (!account || userGIVPowerBalance.balance === '0');
	const availableStakedToken = isGIVpower
		? stakedLpAmount.sub(userGIVLocked.balance)
		: stakedLpAmount;

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
				{(isDiscontinued || exploited) && disableModal && (
					<DisableModal>
						<DisableModalContent>
							<DisableModalImage>
								<IconInfoFilled24 />
							</DisableModalImage>
							<Flex
								flexDirection='column'
								justifyContent='space-evenly'
							>
								<DisableModalText weight={700}>
									{formatMessage({
										id: 'label.this_farm_has_ended',
									})}
								</DisableModalText>
								<DisableModalText>
									{exploited ? (
										<>
											{formatMessage({
												id: 'label.an_exploit_has_removed_available_rewards',
											})}
											<DisableModalLink
												as='a'
												size='Big'
												target='_blank'
												href='https://forum.giveth.io/t/ending-givfarm-liquidity-incentives-programs-for-giv/872'
											>
												&nbsp;
												{formatMessage({
													id: 'label.this_forum_post',
												})}
												&nbsp;
											</DisableModalLink>
											{formatMessage({
												id: 'label.for_details',
											})}
										</>
									) : (
										formatMessage({
											id: 'label.harvest_your_rewards_and_remove_your_funds',
										})
									)}
								</DisableModalText>
								<DisableModalCloseButton
									label={formatMessage({
										id: 'label.got_it',
									})}
									onClick={() => setDisableModal(false)}
								/>
							</Flex>
						</DisableModalContent>
					</DisableModal>
				)}
				{state === StakeCardState.NORMAL ? (
					<>
						<StakingPoolExchangeRow gap='4px' alignItems='center'>
							{getPoolIconWithName(platform, poolNetwork)}
							<StakingPoolExchange styleType='Small'>
								{platformTitle || platform}
							</StakingPoolExchange>
							{poolNetwork === config.XDAI_NETWORK_NUMBER &&
								type === StakingType.GIV_LM && (
									<IconWithTooltip
										direction={'top'}
										icon={
											<IconHelpFilled
												color={brandColors.deep[100]}
												size={12}
											/>
										}
									>
										<GIVgardenTooltip>
											{formatMessage({
												id: 'label.staking_giv_in_this_pool_allows_to_support_verified_projects',
											})}
										</GIVgardenTooltip>
									</IconWithTooltip>
								)}
							<FlexSpacer />
							{notif && notif}
							{introCard && (
								<IntroIcon
									onClick={() =>
										setState(StakeCardState.INTRO)
									}
								>
									<IconHelpFilled16 />
								</IntroIcon>
							)}
							{isGIVpower && (
								<IntroIcon
									onClick={() =>
										setState(StakeCardState.GIVPOWER_INTRO)
									}
								>
									<IconHelpFilled16 />
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
										<FlexCenter gap='8px'>
											<DetailLabel>APR</DetailLabel>
											{type ===
												StakingType.ICHI_GIV_ONEGIV && (
												<IconWithTooltip
													direction='right'
													icon={<IconHelpFilled16 />}
												>
													<AngelVaultTooltip>
														{formatMessage({
															id: 'label.your_cummulative_apr_including_both_rewards',
														})}{' '}
														(
														{apr?.vaultIRR &&
															formatEthHelper(
																apr.vaultIRR,
															)}
														% IRR),{' '}
														{formatMessage({
															id: 'label.and_rewards_earned_in_giv',
														})}{' '}
														(
														{apr &&
															formatEthHelper(
																apr.effectiveAPR,
															)}
														% APR).
													</AngelVaultTooltip>
												</IconWithTooltip>
											)}
											{isGIVpower && (
												<IconWithTooltip
													direction='right'
													icon={<IconHelpFilled16 />}
												>
													<AngelVaultTooltip>
														{isZeroGIVStacked
															? formatMessage({
																	id: 'label.this_is_the_range_of_possible_apr',
															  })
															: `${formatMessage({
																	id: 'label.this_is_the_weighed_average_apr',
															  })} ${
																	apr &&
																	formatEthHelper(
																		apr.effectiveAPR,
																	)
															  }%-${
																	apr &&
																	formatEthHelper(
																		apr.effectiveAPR.multipliedBy(
																			5.2, // sqrt(1 + max rounds)
																		),
																	)
															  }%. ${formatMessage(
																	{
																		id: 'label.lock_your_giv_for_longer',
																	},
															  )}`}
													</AngelVaultTooltip>
												</IconWithTooltip>
											)}
										</FlexCenter>
										<Flex gap='8px' alignItems='center'>
											{!(exploited || isDiscontinued) ? (
												<>
													<IconSpark
														size={24}
														color={
															brandColors
																.mustard[500]
														}
													/>
													<>
														<DetailValue>
															{apr &&
																formatEthHelper(
																	isLocked
																		? avgAPR(
																				apr.effectiveAPR,
																				stakedLpAmount.toString(),
																				userGIVPowerBalance.balance,
																		  )
																		: apr.effectiveAPR,
																)}
															%
															{isZeroGIVStacked &&
																`-${
																	apr &&
																	formatEthHelper(
																		apr.effectiveAPR.multipliedBy(
																			5.2, // sqrt(1 + max rounds)
																		),
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
															<IconHelpFilled />
														</IconContainer>
													</>
												</>
											) : (
												<div>
													{formatMessage({
														id: 'label.n/a',
													})}{' '}
													%
												</div>
											)}
										</Flex>
									</FirstDetail>
									<Detail justifyContent='space-between'>
										<DetailLabel>
											{formatMessage({
												id: 'label.claimable',
											})}
										</DetailLabel>
										<DetailValue>
											{!exploited ? (
												`${formatWeiHelper(
													rewardLiquidPart,
												)} ${rewardTokenSymbol}`
											) : (
												<div>
													{formatMessage({
														id: 'label.n/a',
													})}
												</div>
											)}
										</DetailValue>
									</Detail>
									<Detail justifyContent='space-between'>
										<Flex gap='8px' alignItems='center'>
											<DetailLabel>
												{formatMessage({
													id: 'label.streaming',
												})}
											</DetailLabel>
											<IconHelpFilledWraper
												onClick={() => {
													setShowWhatIsGIVstreamModal(
														true,
													);
												}}
											>
												<IconHelpFilled16 />
											</IconHelpFilledWraper>
										</Flex>
										<Flex gap='4px' alignItems='center'>
											<DetailValue>
												{!exploited ? (
													formatWeiHelper(
														rewardStream,
													)
												) : (
													<div>
														{formatMessage({
															id: 'label.n/a',
														})}
													</div>
												)}
											</DetailValue>
											<DetailUnit>
												{rewardTokenSymbol}
												{formatMessage({
													id: 'label./week',
												})}
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
							<HarvestButtonsWrapper>
								<ClaimButton
									disabled={exploited || earned.isZero()}
									onClick={() => setShowHarvestModal(true)}
									label={formatMessage({
										id: 'label.harvest_rewards',
									})}
									buttonType={
										isGIVpower ? 'secondary' : 'primary'
									}
								/>
								{isGIVpower && (
									<ClaimButton
										disabled={availableStakedToken.lte(
											constants.Zero,
										)}
										onClick={() => setShowLockModal(true)}
										label={formatMessage({
											id: 'label.increase_rewards',
										})}
										buttonType='primary'
									/>
								)}
							</HarvestButtonsWrapper>
							<StakeButtonsRow>
								<StakeContainer flexDirection='column'>
									<StakeButton
										label={formatMessage({
											id: 'label.stake',
										})}
										size='small'
										disabled={
											isDiscontinued ||
											exploited ||
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
										label={formatMessage({
											id: 'label.unstake',
										})}
										size='small'
										disabled={availableStakedToken.isZero()}
										onClick={() =>
											setShowUnStakeModal(true)
										}
									/>
									<FlexCenter gap='5px'>
										<StakeAmount>
											{type ===
											StakingType.UNISWAPV3_ETH_GIV
												? `${stakedLpAmount.toNumber()} ${unit}`
												: `${formatWeiHelper(
														stakedLpAmount,
												  )} ${unit}`}
										</StakeAmount>
										{isLocked && (
											<IconWithTooltip
												icon={<IconHelpFilled16 />}
												direction={'top'}
											>
												<LockInfotooltip>
													{formatMessage({
														id: 'label.some_or_all_of_your_staked_giv_is_locked',
													})}
												</LockInfotooltip>
											</IconWithTooltip>
										)}
									</FlexCenter>
								</StakeContainer>
							</StakeButtonsRow>
							{!(exploited || isDiscontinued) &&
								(!isGIVpower ? (
									<Flex>
										<LiquidityButton
											label={formatMessage({
												id: 'label.provide_liquidity',
											})}
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
										label={formatMessage({
											id: 'label.locked_giv_details',
										})}
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
				) : isBridge ? (
					<BridgeGIVModal setShowModal={setShowStakeModal} />
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
						maxAmount={availableStakedToken}
					/>
				))}
			{showHarvestModal && chainId && (
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
			)}
			{showLockModal && (
				<LockModal
					setShowModal={setShowLockModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={availableStakedToken}
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
					unstakeable={availableStakedToken}
				/>
			)}
		</>
	);
};

export default BaseStakingCard;
