import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	brandColors,
	Caption,
	IconGIVBack,
	IconGIVFarm,
	IconGIVStream,
	IconHelpFilled16,
	Lead,
	P,
} from '@giveth/ui-design-system';
import { constants, BigNumber as EthBigNumber } from 'ethers';
import { useIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import LoadingAnimation from '@/animations/loading.json';
import {
	PoolStakingConfig,
	RegenStreamConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import { BN, formatWeiHelper, Zero } from '@/helpers/number';
import { harvestTokens } from '@/lib/stakingPool';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import {
	CancelButton,
	GIVRate,
	HarvestAllDesc,
	HarvestAllModalContainer,
	HarvestButton,
	HelpRow,
	TooltipContent,
	HarvestBoxes,
	HarvestAllPending,
	BreakdownTitle,
	BreakdownAmount,
	BreakdownIcon,
	BreakdownRate,
	BreakdownRow,
	BreakdownTableBody,
	BreakdownTableTitle,
	BreakdownUnit,
	GIVbackStreamDesc,
	BreakdownSumRow,
	BreakdownLiquidSum,
	BreakdownStreamSum,
	PoolIcon,
} from './HarvestAll.sc';
import { claimReward, fetchAirDropClaimData } from '@/lib/claim';
import config from '@/configuration';
import { IconWithTooltip } from '../IconWithToolTip';
import { AmountBoxWithPrice } from '@/components/AmountBoxWithPrice';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { LiquidityPosition } from '@/types/nfts';
import { Flex } from '../styled-components/Flex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import LottieControl from '@/components/LottieControl';
import { getPoolIconWithName } from '@/helpers/platform';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';
import { useStakingPool } from '@/hooks/useStakingPool';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';

interface IHarvestAllInnerModalProps {
	title: string;
	poolStakingConfig?: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	stakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

interface IHarvestAllModalProps extends IModal, IHarvestAllInnerModalProps {}

enum HarvestStates {
	HARVEST,
	HARVESTING,
	SUBMITTED,
	CONFIRMED,
	ERROR,
}

export const HarvestAllModal: FC<IHarvestAllModalProps> = ({
	title,
	setShowModal,
	poolStakingConfig,
	regenStreamConfig,
	stakedPositions,
	currentIncentive,
}) => {
	const [state, setState] = useState<HarvestStates>(HarvestStates.HARVEST);
	const tokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const { formatMessage } = useIntl();
	const {
		mainnetThirdPartyTokensPrice,
		xDaiThirdPartyTokensPrice,
		givPrice,
	} = useAppSelector(state => state.price);
	const { account, library } = useWeb3React();
	const [txHash, setTxHash] = useState('');
	//GIVdrop TODO: Should we show Givdrop in new  design?
	const [givDrop, setGIVdrop] = useState(constants.Zero);
	const [givDropStream, setGIVdropStream] = useState<BigNumber>(Zero);
	//GIVstream
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber>(Zero);
	//GIVfarm
	const [earnedLiquid, setEarnedLiquid] = useState(constants.Zero);
	const [earnedStream, setEarnedStream] = useState<BigNumber>(Zero);
	//GIVbacks
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	//Sum
	const [sumLiquid, setSumLiquid] = useState(constants.Zero);
	const [sumStream, setSumStream] = useState<BigNumber>(Zero);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const { chainId } = useWeb3React();
	const { tokenDistroHelper, sdh } = useTokenDistroHelper(
		chainId!,
		regenStreamConfig,
	);

	const tokenDistroBalance = regenStreamConfig
		? sdh.getTokenDistroBalance(regenStreamConfig.tokenDistroAddress)
		: sdh.getGIVTokenDistroBalance();
	const givback = useMemo<EthBigNumber>(
		() => BN(tokenDistroBalance.givback),
		[tokenDistroBalance],
	);
	const givbackLiquidPart = useMemo<EthBigNumber>(
		() => BN(tokenDistroBalance.givbackLiquidPart),
		[tokenDistroBalance],
	);

	const tokenPrice = useMemo(() => {
		const currentPrice =
			chainId === config.MAINNET_NETWORK_NUMBER
				? mainnetThirdPartyTokensPrice
				: xDaiThirdPartyTokensPrice;
		const price = regenStreamConfig
			? currentPrice[regenStreamConfig.tokenAddressOnUniswapV2]
			: givPrice;
		return new BigNumber(price);
	}, [givPrice, chainId, regenStreamConfig]);

	useEffect(() => {
		if (!tokenDistroHelper) return;
		setEarnedLiquid(
			tokenDistroHelper.getUserClaimableNow(tokenDistroBalance),
		);
		const lockedAmount = BN(tokenDistroBalance.allocatedTokens).sub(
			givback,
		);
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount),
		);
		setGivBackStream(tokenDistroHelper.getStreamPartTokenPerWeek(givback));
	}, [tokenDistroBalance, tokenDistroHelper, givback, regenStreamConfig]);

	//calculate Liquid Sum
	useEffect(() => {
		setSumLiquid(rewardLiquidPart.add(earnedLiquid)); // earnedLiquid includes the givbacks liquid part
	}, [rewardLiquidPart, earnedLiquid]);

	//calculate Stream Sum
	useEffect(() => {
		setSumStream(BigNumber.sum(rewardStream, earnedStream)); // earnedStream includes the givbacks stream part
	}, [rewardStream, earnedStream]);

	useEffect(() => {
		if (!tokenDistroHelper) return;
		if (
			!regenStreamConfig &&
			chainId === config.XDAI_NETWORK_NUMBER &&
			!tokenDistroBalance.givDropClaimed &&
			account
		) {
			fetchAirDropClaimData(account).then(claimData => {
				if (claimData) {
					const givDrop = EthBigNumber.from(claimData.amount);
					setGIVdrop(givDrop.div(10));
					setGIVdropStream(
						tokenDistroHelper.getStreamPartTokenPerWeek(givDrop),
					);
				}
			});
		}
	}, [
		account,
		chainId,
		tokenDistroBalance?.givDropClaimed,
		tokenDistroHelper,
		regenStreamConfig,
	]);

	const onHarvest = async () => {
		if (!library || !account || !tokenDistroHelper) return;
		setState(HarvestStates.HARVESTING);
		try {
			if (poolStakingConfig) {
				if (
					poolStakingConfig.hasOwnProperty(
						'NFT_POSITIONS_MANAGER_ADDRESS',
					)
				) {
					if (!currentIncentive || !stakedPositions) return;
					//NFT Harvest
					const txResponse = await claimUnstakeStake(
						account,
						library,
						currentIncentive,
						stakedPositions,
					);
					if (txResponse) {
						const { status } = await txResponse.wait();
						setState(
							status
								? HarvestStates.CONFIRMED
								: HarvestStates.ERROR,
						);
					} else {
						setState(HarvestStates.HARVEST);
					}
				} else {
					// LP Harvest
					const txResponse = await harvestTokens(
						(poolStakingConfig as SimplePoolStakingConfig)
							.LM_ADDRESS,
						library,
					);
					if (txResponse) {
						setState(HarvestStates.SUBMITTED);
						setTxHash(txResponse.hash);
						const { status } = await txResponse.wait();
						setState(
							status
								? HarvestStates.CONFIRMED
								: HarvestStates.ERROR,
						);
					} else {
						setState(HarvestStates.HARVEST);
					}
				}
			} else {
				const txResponse = await claimReward(
					tokenDistroHelper.contractAddress,
					library,
				);
				if (txResponse) {
					setState(HarvestStates.SUBMITTED);
					setTxHash(txResponse.hash);
					const { status } = await txResponse.wait();
					setState(
						status ? HarvestStates.CONFIRMED : HarvestStates.ERROR,
					);
				} else {
					setState(HarvestStates.HARVEST);
				}
			}
		} catch (error: any) {
			setState(
				error?.code === 4001
					? HarvestStates.HARVEST
					: HarvestStates.ERROR,
			);
			captureException(error, {
				tags: {
					section: 'onHarvest',
				},
			});
		}
	};

	const modalTitle = regenStreamConfig ? 'RegenFarm Rewards' : title;

	const calcUSD = (amount: string) => {
		const price = tokenPrice || new BigNumber(givPrice);
		return price.isNaN() ? '0' : price.times(amount).toFixed(2);
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={modalTitle}
			headerTitlePosition={'left'}
		>
			<HarvestAllModalContainer>
				{(state === HarvestStates.HARVEST ||
					state === HarvestStates.HARVESTING) && (
					<HarvestBoxes>
						{sumLiquid && sumLiquid.gt(0) && (
							<>
								<AmountBoxWithPrice
									amount={sumLiquid}
									price={calcUSD(
										formatWeiHelper(sumLiquid, 2, false),
									)}
									tokenSymbol={
										regenStreamConfig?.rewardTokenSymbol
									}
								/>
								<HelpRow alignItems='baseline' flexWrap>
									<Caption>
										{formatMessage({
											id: 'label.your_new',
										})}{' '}
										{tokenSymbol}{' '}
										{formatMessage({
											id: 'label.stream_flowrate',
										})}
									</Caption>
									<IconWithTooltip
										icon={
											<IconHelpFilled16
												color={brandColors.deep[100]}
											/>
										}
										direction={'top'}
									>
										<TooltipContent>
											{formatMessage({
												id: 'label.increase_your',
											})}{' '}
											{tokenSymbol}
											{formatMessage({
												id: 'label.stream_flowrate_when_you_claim',
											})}
										</TooltipContent>
									</IconWithTooltip>
									<Flex gap='8px'>
										<IconGIVStream size={24} />
										<GIVRate>
											{formatWeiHelper(sumStream)}
										</GIVRate>
										<Lead>
											{tokenSymbol}
											{formatMessage({
												id: 'label./week',
											})}
										</Lead>
									</Flex>
								</HelpRow>
							</>
						)}
						<HarvestAllDesc>
							{formatMessage(
								{
									id: 'label.when_you_harvest',
								},
								{ tokenSymbol },
							)}
						</HarvestAllDesc>
						<BreakdownTableTitle>
							{formatMessage({
								id: 'label.rewards_breakdown',
							})}
						</BreakdownTableTitle>
						<BreakdownTableBody>
							<BreakdownRow>
								<BreakdownTitle>
									<BreakdownIcon>
										<IconGIVStream size={24} />
									</BreakdownIcon>
									<P>{tokenSymbol}stream</P>
								</BreakdownTitle>
								<BreakdownAmount>
									{formatWeiHelper(
										earnedLiquid.sub(givbackLiquidPart),
									)}
								</BreakdownAmount>
								<BreakdownUnit>{tokenSymbol}</BreakdownUnit>
								<BreakdownRate>
									{formatWeiHelper(
										rewardStream.minus(givBackStream),
									)}
								</BreakdownRate>
								<BreakdownUnit>
									{tokenSymbol}
									{formatMessage({
										id: 'label./week',
									})}
								</BreakdownUnit>
								{givBackStream != 0 && (
									<>
										<GIVbackStreamDesc>
											{formatMessage({
												id: 'label.received_from_givbacks',
											})}
										</GIVbackStreamDesc>
										<BreakdownRate>
											{formatWeiHelper(givBackStream)}
										</BreakdownRate>
										<BreakdownUnit>
											{tokenSymbol}
											{formatMessage({
												id: 'label./week',
											})}
											<IconWithTooltip
												icon={
													<Flex gap='4px'>
														<IconHelpFilled16
															color={
																brandColors
																	.deep[100]
															}
														/>
													</Flex>
												}
												direction={'left'}
											>
												<TooltipContent>
													{formatMessage({
														id: 'label.your_givstream_flowrate_was_automatically_increased',
													})}
												</TooltipContent>
											</IconWithTooltip>
										</BreakdownUnit>
									</>
								)}
							</BreakdownRow>
							{!regenStreamConfig && givback.gt(0) && (
								<BreakdownRow>
									<BreakdownTitle>
										<BreakdownIcon>
											<IconGIVBack size={24} />
										</BreakdownIcon>
										<P>GIVbacks</P>
									</BreakdownTitle>
									<BreakdownAmount>
										{formatWeiHelper(givbackLiquidPart)}
									</BreakdownAmount>
									<BreakdownUnit>{tokenSymbol}</BreakdownUnit>
									<BreakdownRate></BreakdownRate>
									<BreakdownUnit></BreakdownUnit>
								</BreakdownRow>
							)}
							{poolStakingConfig && tokenDistroHelper && (
								<EarnedBreakDown
									poolStakingConfig={poolStakingConfig}
									regenStreamConfig={regenStreamConfig}
									tokenDistroHelper={tokenDistroHelper}
									setRewardLiquidPart={setRewardLiquidPart}
									setEarnedStream={setEarnedStream}
									rewardLiquidPart={rewardLiquidPart}
									tokenSymbol={tokenSymbol}
									earnedStream={earnedStream}
								/>
							)}

							<BreakdownSumRow>
								<div></div>
								<BreakdownLiquidSum>
									{formatWeiHelper(sumLiquid)}
								</BreakdownLiquidSum>
								<BreakdownUnit>{tokenSymbol}</BreakdownUnit>
								<BreakdownStreamSum>
									<IconGIVStream size={24} />
									<P>{formatWeiHelper(sumStream)}</P>
								</BreakdownStreamSum>
								<BreakdownUnit>
									{tokenSymbol}
									{formatMessage({
										id: 'label./week',
									})}
								</BreakdownUnit>
							</BreakdownSumRow>
						</BreakdownTableBody>

						{state === HarvestStates.HARVEST && (
							<HarvestButton
								label={formatMessage({
									id: 'label.harvest',
								})}
								size='medium'
								buttonType='primary'
								onClick={onHarvest}
								disabled={sumLiquid.eq(0)}
							/>
						)}
						{state === HarvestStates.HARVESTING && (
							<HarvestAllPending>
								<LottieControl
									animationData={LoadingAnimation}
									size={40}
								/>
								&nbsp;
								{formatMessage({
									id: 'label.harvest_pending',
								})}
							</HarvestAllPending>
						)}
						<CancelButton
							disabled={state !== HarvestStates.HARVEST}
							label={formatMessage({
								id: 'label.cancel',
							})}
							size='medium'
							buttonType='texty'
							onClick={closeModal}
						/>
					</HarvestBoxes>
				)}
				{state === HarvestStates.SUBMITTED && (
					<SubmittedInnerModal
						title={title}
						txHash={txHash}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
					/>
				)}
				{state === HarvestStates.CONFIRMED && (
					<ConfirmedInnerModal
						title={title}
						txHash={txHash}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
					/>
				)}
				{state === HarvestStates.ERROR && (
					<ErrorInnerModal
						title={formatMessage({
							id: 'label.something_went_wrong',
						})}
						txHash={txHash}
					/>
				)}
			</HarvestAllModalContainer>
		</Modal>
	);
};

interface IEarnedBreakDownProps {
	poolStakingConfig: PoolStakingConfig;
	tokenDistroHelper: TokenDistroHelper;
	setRewardLiquidPart: Dispatch<SetStateAction<EthBigNumber>>;
	setEarnedStream: Dispatch<SetStateAction<BigNumber>>;
	regenStreamConfig?: RegenStreamConfig;
	rewardLiquidPart: EthBigNumber;
	tokenSymbol: string;
	earnedStream: BigNumber;
}

const EarnedBreakDown: FC<IEarnedBreakDownProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	tokenDistroHelper,
	setRewardLiquidPart,
	setEarnedStream,
	rewardLiquidPart,
	tokenSymbol,
	earnedStream,
}) => {
	const { earned } = useStakingPool(poolStakingConfig);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (!tokenDistroHelper) return;
		if (earned) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(earned));
			setEarnedStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(earned),
			);
		}
	}, [earned, tokenDistroHelper]);

	return earned && earned.gt(0) ? (
		<BreakdownRow>
			<BreakdownTitle>
				<BreakdownIcon>
					<IconGIVFarm size={24} />
				</BreakdownIcon>
				<P>{regenStreamConfig ? 'RegenFarm' : 'GIVfarm'}</P>
				{poolStakingConfig.title}
				<PoolIcon>
					{getPoolIconWithName(poolStakingConfig.platform)}
				</PoolIcon>
			</BreakdownTitle>
			<BreakdownAmount>
				{formatWeiHelper(rewardLiquidPart)}
			</BreakdownAmount>
			<BreakdownUnit>{tokenSymbol}</BreakdownUnit>
			<BreakdownRate>+{formatWeiHelper(earnedStream)}</BreakdownRate>
			<BreakdownUnit>
				{tokenSymbol}
				{formatMessage({
					id: 'label./week',
				})}
			</BreakdownUnit>
		</BreakdownRow>
	) : null;
};
