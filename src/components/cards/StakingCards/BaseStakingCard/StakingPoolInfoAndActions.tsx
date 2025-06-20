import {
	IconHelpFilled16,
	IconSpark,
	brandColors,
	IconHelpFilled,
	IconExternalLink,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { ArchiveCover } from '@/components/ArchiveAndNetworkCover/ArchiveCover';
import FarmCountDown from '@/components/FarmCountDown';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { avgAPR } from '@/helpers/givpower';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
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
import LockModal from '@/components/modals/StakeLock/Lock';
import { WhatIsStreamModal } from '@/components/modals/WhatIsStream';
import { LockupDetailsModal } from '@/components/modals/LockupDetailsModal';
import ExternalLink from '@/components/ExternalLink';
import { useSubgraphSyncInfo } from '@/hooks/useSubgraphSyncInfo';

interface IStakingPoolInfoAndActionsProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	isDiscontinued: boolean;
	isGIVpower: boolean;
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
	isArchived?: boolean; // <-- Add here, as a top-level prop!
}

export const StakingPoolInfoAndActions: FC<IStakingPoolInfoAndActionsProps> = ({
	poolStakingConfig,
	isDiscontinued,
	isGIVpower,
	currentIncentive,
	isArchived = false, // default to false if not passed
}) => {
	const [started, setStarted] = useState(true);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(0n);
	const [rewardStream, setRewardStream] = useState(0n);
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

	const { formatMessage } = useIntl();
	const { setChainInfo } = useFarms();
	const router = useRouter();
	const subgraphSyncedInfo = useSubgraphSyncInfo(poolStakingConfig.network);
	const hold =
		showAPRModal ||
		showStakeModal ||
		showUnStakeModal ||
		showHarvestModal ||
		showLockModal;
	const {
		apr,
		notStakedAmount: userNotStakedAmount,
		stakedAmount: stakedLpAmount,
		earned,
	} = useStakingPool(poolStakingConfig, hold);
	const { address, isConnected: isWalletActive } = useAccount();
	const { chain } = useAccount();
	const chainId = chain?.id;

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
		? config.EVM_NETWORKS_CONFIG[poolNetwork].regenStreams?.find(
				regenStream => regenStream.type === regenStreamType,
			)
		: undefined;

	const { tokenDistroHelper, sdh } = useTokenDistroHelper(
		poolNetwork,
		regenStreamConfig,
		hold,
	);

	const userGIVLocked = sdh.getUserGIVLockedBalance();
	const POLYGON_ZKEVM_DEPRECATION_MS = Date.UTC(2025, 5, 10, 16, 0, 0); // June 10, 2025 11am Panama
	const POLYGON_ZKEVM_HIDE_DATE_MS = Date.UTC(2025, 6, 10, 0, 0, 0); // July 10, 2025
	const ARCHIVE_NOTICE_KEY = 'givfarm_zkevm_archive_notice_dismissed';

	useEffect(() => {
		setStarted(farmStartTimeMS ? getNowUnixMS() > farmStartTimeMS : true);
	}, [farmStartTimeMS]);

	useEffect(() => {
		if (!(exploited || regenStreamConfig))
			setChainInfo(poolNetwork, type, earned);
	}, [poolNetwork, earned, type, regenStreamConfig, setChainInfo, exploited]);

	const isLocked = isGIVpower && userGIVLocked.balance !== '0';

	const availableStakedToken = isGIVpower
		? stakedLpAmount - BigInt(userGIVLocked.balance)
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
		const _chainId = parseInt(_chain || '');
		const checkNetworkAndShowStakeModal = async () => {
			if (
				_chainId === chainId &&
				_chainId === poolNetwork &&
				_open === type
			) {
				if (address) {
					setShowStakeModal(true);
					setIsFirstStakeShown(true);
					router.replace(Routes.GIVfarm, undefined, {
						shallow: true,
					});
				}
			}
		};
		checkNetworkAndShowStakeModal();
	}, [router, address, isWalletActive]);

	const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
	const rewardTokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const isZeroGIVStacked =
		isGIVpower && (!address || userGIVPowerBalance.balance === '0');
	const [showArchiveNotice, setShowArchiveNotice] = useState(false);
	const isZkEvmPool =
		poolStakingConfig.network === config.ZKEVM_NETWORK_NUMBER; // ZKEVM network number

	useEffect(() => {
		const now = Date.now();
		const isZkEvmPool =
			poolStakingConfig.network === config.ZKEVM_NETWORK_NUMBER; // ZKEVM network number

		const inArchivingWindow =
			now >= POLYGON_ZKEVM_DEPRECATION_MS &&
			now < POLYGON_ZKEVM_HIDE_DATE_MS;

		const shouldShowArchive =
			isZkEvmPool &&
			(inArchivingWindow || isArchived) &&
			!localStorage.getItem(ARCHIVE_NOTICE_KEY);

		setShowArchiveNotice(shouldShowArchive);
	}, [poolStakingConfig.network, isArchived]);
	const isArchivingPeriod =
		!isArchived &&
		Date.now() >= POLYGON_ZKEVM_DEPRECATION_MS &&
		Date.now() < POLYGON_ZKEVM_HIDE_DATE_MS;

	return (
		<StakePoolInfoContainer>
			{showArchiveNotice && (
				<ArchiveCover
					isExploited={exploited}
					isStream={!!regenStreamConfig}
				/>
			)}

			{started ? (
				<Details $flexDirection='column'>
					<Flex $justifyContent='space-between'>
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
										{apr?.vaultIRR
											? apr?.vaultIRR?.toString()
											: '0'}
										% IRR),{' '}
										{formatMessage({
											id: 'label.and_rewards_earned_in_giv',
										})}{' '}
										({apr && apr.effectiveAPR.toString()}%
										APR).
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
														apr.effectiveAPR.toString(),
													)
												}%-${
													apr &&
													formatEthHelper(
														apr.effectiveAPR.multipliedBy(
															5.196,
														), // sqrt(1 + max rounds)
													)
												}%. ${formatMessage({
													id: 'label.lock_your_giv_for_longer',
												})}`}
									</AngelVaultTooltip>
								</IconWithTooltip>
							)}
						</FlexCenter>
						<Flex gap='8px' $alignItems='center'>
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
																stakedLpAmount,
																BigInt(
																	userGIVPowerBalance.balance,
																),
															).toString()
														: apr.effectiveAPR.toString(),
												)}
											%
											{isZeroGIVStacked &&
												`-${
													apr &&
													formatEthHelper(
														apr.effectiveAPR.multipliedBy(
															5.2,
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
					<Flex $justifyContent='space-between'>
						<DetailLabel>
							{formatMessage({
								id: 'label.claimable',
							})}
						</DetailLabel>
						<DetailValue>
							{!exploited ? (
								`${formatWeiHelper(
									rewardLiquidPart.toString(),
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
					<Flex $justifyContent='space-between'>
						<Flex gap='8px' $alignItems='center'>
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
						<Flex gap='4px' $alignItems='center'>
							<DetailValue>
								{!exploited ? (
									formatWeiHelper(rewardStream.toString())
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
					disabled={
						exploited ||
						earned === 0n ||
						!started ||
						!subgraphSyncedInfo.isSynced
					}
					onClick={() => setShowHarvestModal(true)}
					label={formatMessage({
						id: 'label.harvest_rewards',
					})}
					buttonType={isGIVpower ? 'secondary' : 'primary'}
				/>
				{isGIVpower && (
					<ClaimButton
						disabled={
							isArchived ||
							availableStakedToken <= 0n ||
							!subgraphSyncedInfo.isSynced ||
							(isArchivingPeriod && isZkEvmPool)
						}
						onClick={() => setShowLockModal(true)}
						label={
							started
								? formatMessage({
										id: 'label.increase_rewards',
									})
								: 'Lock your GIV'
						}
						buttonType='primary'
					/>
				)}
			</HarvestButtonsWrapper>
			<StakeButtonsRow>
				<StakeContainer $flexDirection='column'>
					<StakeButton
						label={formatMessage({
							id: 'label.stake',
						})}
						size='small'
						disabled={
							isArchived ||
							isDiscontinued ||
							exploited ||
							userNotStakedAmount === 0n ||
							!subgraphSyncedInfo.isSynced ||
							(isArchivingPeriod && isZkEvmPool)
						}
						onClick={() => setShowStakeModal(true)}
					/>
					<StakeAmount>
						{type === StakingType.UNISWAPV3_ETH_GIV
							? `${userNotStakedAmount.toString()} ${unit}`
							: `${formatWeiHelper(
									userNotStakedAmount.toString(),
								)} ${unit}`}
					</StakeAmount>
				</StakeContainer>
				<StakeContainer $flexDirection='column'>
					<StakeButton
						label={formatMessage({
							id: 'label.unstake',
						})}
						size='small'
						disabled={
							availableStakedToken === 0n ||
							!subgraphSyncedInfo.isSynced
						}
						onClick={() => setShowUnStakeModal(true)}
					/>
					<FlexCenter gap='5px'>
						<StakeAmount>
							{type === StakingType.UNISWAPV3_ETH_GIV
								? `${stakedLpAmount.toString()} ${unit}`
								: `${formatWeiHelper(
										stakedLpAmount.toString(),
									)} ${unit}`}
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
					currentIncentive={currentIncentive}
				/>
			)}
			{showLockModal && (
				<LockModal
					setShowModal={setShowLockModal}
					poolStakingConfig={poolStakingConfig}
					isGIVpower={isGIVpower}
					started={started}
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
