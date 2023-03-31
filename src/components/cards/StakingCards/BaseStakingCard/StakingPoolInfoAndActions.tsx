import {
	IconHelpFilled16,
	IconSpark,
	brandColors,
	IconHelpFilled,
	IconExternalLink,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import FarmCountDown from '@/components/FarmCountDown';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { FlexCenter, Flex } from '@/components/styled-components/Flex';
import { avgAPR } from '@/helpers/givpower';
import { BN, formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	SimpleNetworkConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';
import {
	Details,
	DetailLabel,
	AngelVaultTooltip,
	DetailValue,
	IconContainer,
	IconHelpFilledWrapper,
	DetailUnit,
	StakePoolInfoContainer,
	ClaimButton,
	HarvestButtonsWrapper,
	LiquidityButton,
	LockInfoTooltip,
	StakeAmount,
	StakeButton,
	StakeButtonsRow,
	StakeContainer,
} from './BaseStakingCard.sc';
import { getNowUnixMS } from '@/helpers/time';
import { useStakingPool } from '@/hooks/useStakingPool';
import { useFarms } from '@/context/farm.context';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';
import { APRModal } from '@/components/modals/APR';
import { StakeModal } from '@/components/modals/StakeLock/Stake';
import { StakeGIVModal } from '@/components/modals/StakeLock/StakeGIV';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import { UnStakeModal } from '@/components/modals/Unstake/UnStake';
import { HarvestAllModal } from '@/components/modals/HarvestAll';
import { LiquidityPosition } from '@/types/nfts';
import LockModal from '@/components/modals/StakeLock/Lock';
import { WhatIsStreamModal } from '@/components/modals/WhatIsStream';
import { LockupDetailsModal } from '@/components/modals/LockupDetailsModal';
import ExternalLink from '@/components/ExternalLink';

interface IStakingPoolInfoAndActionsProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	isDiscontinued: boolean;
	isGIVpower: boolean;
	stakedPositions?: LiquidityPosition[];
	unstakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

export const StakingPoolInfoAndActions: FC<IStakingPoolInfoAndActionsProps> = ({
	poolStakingConfig,
	isDiscontinued,
	isGIVpower,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
}) => {
	const [started, setStarted] = useState(true);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [isFirstStakeShown, setIsFirstStakeShown] = useState(false);
	//Modals
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showLockModal, setShowLockModal] = useState(false);
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);

	const hold =
		showAPRModal ||
		showStakeModal ||
		showUnStakeModal ||
		showHarvestModal ||
		showLockModal;
	const { formatMessage } = useIntl();
	const { setInfo } = useFarms();
	const router = useRouter();
	const {
		apr,
		notStakedAmount: userNotStakedAmount,
		stakedAmount: stakedLpAmount,
		earned,
	} = useStakingPool(poolStakingConfig, hold);
	const { chainId, account, active: isWalletActive } = useWeb3React();

	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const {
		type,
		unit,
		farmStartTimeMS,
		exploited,
		network: poolNetwork,
		provideLiquidityLink,
	} = poolStakingConfig;
	const regenStreamConfig = regenStreamType
		? (
				config.NETWORKS_CONFIG[poolNetwork] as SimpleNetworkConfig
		  ).regenStreams.find(
				regenStream => regenStream.type === regenStreamType,
		  )
		: undefined;

	const { tokenDistroHelper, sdh } = useTokenDistroHelper(
		poolNetwork,
		regenStreamConfig,
		hold,
	);

	const userGIVLocked = sdh.getUserGIVLockedBalance();

	useEffect(() => {
		setStarted(farmStartTimeMS ? getNowUnixMS() > farmStartTimeMS : true);
	}, [farmStartTimeMS]);

	useEffect(() => {
		if (!(exploited || regenStreamConfig))
			setInfo(poolNetwork, type, earned);
	}, [poolNetwork, earned, type, regenStreamConfig, setInfo]);

	const isLocked = isGIVpower && userGIVLocked.balance !== '0';

	const availableStakedToken = isGIVpower
		? stakedLpAmount.sub(userGIVLocked.balance)
		: stakedLpAmount;

	useEffect(() => {
		if (tokenDistroHelper) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(earned));
			setRewardStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(earned),
			);
		}
	}, [earned, tokenDistroHelper]);

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

	const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
	const rewardTokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const isZeroGIVStacked =
		isGIVpower && (!account || userGIVPowerBalance.balance === '0');

	return (
		<StakePoolInfoContainer>
			{started ? (
				<Details>
					<Flex justifyContent='space-between'>
						<FlexCenter gap='8px'>
							<DetailLabel>APR</DetailLabel>
							{type === StakingType.ICHI_GIV_ONEGIV && (
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
											formatEthHelper(apr.vaultIRR)}
										% IRR),{' '}
										{formatMessage({
											id: 'label.and_rewards_earned_in_giv',
										})}{' '}
										(
										{apr &&
											formatEthHelper(apr.effectiveAPR)}
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
															5.196152423, // sqrt(1 + max rounds)
														),
													)
											  }%. ${formatMessage({
													id: 'label.lock_your_giv_for_longer',
											  })}`}
									</AngelVaultTooltip>
								</IconWithTooltip>
							)}
						</FlexCenter>
						<Flex gap='8px' alignItems='center'>
							{!(exploited || isDiscontinued) ? (
								<>
									<IconSpark
										size={24}
										color={brandColors.mustard[500]}
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
												setShowAPRModal(true)
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
					</Flex>
					<Flex justifyContent='space-between'>
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
					</Flex>
					<Flex justifyContent='space-between'>
						<Flex gap='8px' alignItems='center'>
							<DetailLabel>
								{formatMessage({
									id: 'label.streaming',
								})}
							</DetailLabel>
							<IconHelpFilledWrapper
								onClick={() => {
									setShowWhatIsGIVstreamModal(true);
								}}
							>
								<IconHelpFilled16 />
							</IconHelpFilledWrapper>
						</Flex>
						<Flex gap='4px' alignItems='center'>
							<DetailValue>
								{!exploited ? (
									formatWeiHelper(rewardStream)
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
					</Flex>
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
					buttonType={isGIVpower ? 'secondary' : 'primary'}
				/>
				{isGIVpower && (
					<ClaimButton
						disabled={availableStakedToken.lte(constants.Zero)}
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
							: `${formatWeiHelper(userNotStakedAmount)} ${unit}`}
					</StakeAmount>
				</StakeContainer>
				<StakeContainer flexDirection='column'>
					<StakeButton
						label={formatMessage({
							id: 'label.unstake',
						})}
						size='small'
						disabled={availableStakedToken.isZero()}
						onClick={() => setShowUnStakeModal(true)}
					/>
					<FlexCenter gap='5px'>
						<StakeAmount>
							{type === StakingType.UNISWAPV3_ETH_GIV
								? `${stakedLpAmount.toNumber()} ${unit}`
								: `${formatWeiHelper(stakedLpAmount)} ${unit}`}
						</StakeAmount>
						{isLocked && (
							<IconWithTooltip
								icon={<IconHelpFilled16 />}
								direction={'top'}
							>
								<LockInfoTooltip>
									{formatMessage({
										id: 'label.some_or_all_of_your_staked_giv_is_locked',
									})}
								</LockInfoTooltip>
							</IconWithTooltip>
						)}
					</FlexCenter>
				</StakeContainer>
			</StakeButtonsRow>
			{!(exploited || isDiscontinued) &&
				(!isGIVpower ? (
					<ExternalLink href={provideLiquidityLink || ''} fullWidth>
						<LiquidityButton
							size='small'
							label={formatMessage({
								id: 'label.provide_liquidity',
							})}
							buttonType='texty'
							icon={
								<IconExternalLink
									size={16}
									color={brandColors.deep[100]}
								/>
							}
						/>
					</ExternalLink>
				) : (
					<LiquidityButton
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
			{showAPRModal && (
				<APRModal
					setShowModal={setShowAPRModal}
					regenStreamConfig={regenStreamConfig}
					regenStreamType={regenStreamType}
					poolNetwork={poolNetwork}
				/>
			)}
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
			{showUnStakeModal && (
				<UnStakeModal
					setShowModal={setShowUnStakeModal}
					poolStakingConfig={
						poolStakingConfig as SimplePoolStakingConfig
					}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
			{showHarvestModal && chainId && (
				<HarvestAllModal
					title={formatMessage({ id: 'label.givfarm_rewards' })}
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					regenStreamConfig={regenStreamConfig}
					stakedPositions={stakedPositions}
					currentIncentive={currentIncentive}
				/>
			)}
			{showLockModal && (
				<LockModal
					setShowModal={setShowLockModal}
					poolStakingConfig={poolStakingConfig}
					isGIVpower={isGIVpower}
				/>
			)}
			{showWhatIsGIVstreamModal && (
				<WhatIsStreamModal
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
		</StakePoolInfoContainer>
	);
};
