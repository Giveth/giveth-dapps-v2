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
import FarmCountDown from '@/components/FarmCountDown';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { FlexCenter, Flex } from '@/components/styled-components/Flex';
import { avgAPR } from '@/helpers/givpower';
import { BN, formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	PoolStakingConfig,
	RegenFarmConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import {
	Details,
	FirstDetail,
	DetailLabel,
	AngelVaultTooltip,
	DetailValue,
	IconContainer,
	Detail,
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
interface IStakingPoolInfoAndActionsProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	regenStreamConfig?: RegenFarmConfig;
	isDiscontinued: boolean;
	isGIVpower: boolean;
	setShowAPRModal: React.Dispatch<React.SetStateAction<boolean>>;
	setShowStakeModal: React.Dispatch<React.SetStateAction<boolean>>;
	setShowUnStakeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StakingPoolInfoAndActions: FC<IStakingPoolInfoAndActionsProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	isDiscontinued,
	isGIVpower,
	setShowAPRModal,
	setShowStakeModal,
	setShowUnStakeModal,
}) => {
	const [started, setStarted] = useState(true);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);

	const { formatMessage } = useIntl();
	const { setInfo } = useFarms();
	const { chainId, account, active: isWalletActive } = useWeb3React();
	const {
		apr,
		notStakedAmount: userNotStakedAmount,
		stakedAmount: stakedLpAmount,
		earned,
	} = useStakingPool(poolStakingConfig);

	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;

	const {
		type,
		unit,
		farmStartTimeMS,
		exploited,
		network: poolNetwork,
	} = poolStakingConfig;
	const { tokenDistroHelper, sdh } = useTokenDistroHelper(
		poolNetwork,
		regenStreamType,
		regenStreamConfig,
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

	const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
	const rewardTokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const isZeroGIVStacked =
		isGIVpower && (!account || userGIVPowerBalance.balance === '0');

	return (
		<StakePoolInfoContainer>
			{started ? (
				<Details>
					<FirstDetail justifyContent='space-between'>
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
															5.2, // sqrt(1 + max rounds)
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
							<IconHelpFilledWrapper
							// onClick={() => {
							// 	setShowWhatIsGIVstreamModal(true);
							// }}
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
					// onClick={() => setShowHarvestModal(true)}
					label={formatMessage({
						id: 'label.harvest_rewards',
					})}
					buttonType={isGIVpower ? 'secondary' : 'primary'}
				/>
				{isGIVpower && (
					<ClaimButton
						disabled={availableStakedToken.lte(constants.Zero)}
						// onClick={() => setShowLockModal(true)}
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
					<Flex>
						<LiquidityButton
							label={formatMessage({
								id: 'label.provide_liquidity',
							})}
							// onClick={() => {
							// 	if (type === StakingType.UNISWAPV3_ETH_GIV) {
							// 		setShowUniV3APRModal(true);
							// 	} else {
							// 		window.open(provideLiquidityLink);
							// 	}
							// }}
							buttonType='texty'
							icon={
								<IconExternalLink
									size={16}
									color={brandColors.deep[100]}
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
						// onClick={() => {
						// 	setShowLockDetailModal(true);
						// }}
					/>
				))}
		</StakePoolInfoContainer>
	);
};
