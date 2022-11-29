import React, { FC, useEffect, useMemo, useState } from 'react';
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
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import LoadingAnimation from '@/animations/loading.json';
import {
	PoolStakingConfig,
	RegenFarmConfig,
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
	NothingToHarvest,
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
import { getPoolIconWithName } from '../cards/BaseStakingCard';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { LiquidityPosition } from '@/types/nfts';
import { Flex } from '../styled-components/Flex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { LottieControl } from '../animations/lottieControl';
import type { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';

interface IHarvestAllModalProps extends IModal {
	title: string;
	poolStakingConfig?: PoolStakingConfig;
	earned?: ethers.BigNumber;
	network: number;
	tokenDistroHelper?: TokenDistroHelper;
	regenStreamConfig?: RegenFarmConfig;
	stakedPositions?: LiquidityPosition[];
	currentIncentive?: {
		key?: (string | number)[] | null | undefined;
	};
}

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
	earned,
	network,
	tokenDistroHelper,
	regenStreamConfig,
	stakedPositions,
	currentIncentive,
}) => {
	const [state, setState] = useState<HarvestStates>(HarvestStates.HARVEST);
	const tokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.currentValues),
	);
	const {
		mainnetThirdPartyTokensPrice,
		xDaiThirdPartyTokensPrice,
		givPrice,
	} = useAppSelector(state => state.price);
	const { account, library } = useWeb3React();
	const [txHash, setTxHash] = useState('');
	//GIVdrop TODO: Should we show Givdrop in new  design?
	const [givDrop, setGIVdrop] = useState(ethers.constants.Zero);
	const [givDropStream, setGIVdropStream] = useState<BigNumber>(Zero);
	//GIVstream
	const [rewardLiquidPart, setRewardLiquidPart] = useState(
		ethers.constants.Zero,
	);
	const [rewardStream, setRewardStream] = useState<BigNumber>(Zero);
	//GIVfarm
	const [earnedLiquid, setEarnedLiquid] = useState(ethers.constants.Zero);
	const [earnedStream, setEarnedStream] = useState<BigNumber>(Zero);
	//GIVbacks
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	//Sum
	const [sumLiquid, setSumLiquid] = useState(ethers.constants.Zero);
	const [sumStream, setSumStream] = useState<BigNumber>(Zero);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const tokenDistroBalance = regenStreamConfig
		? sdh.getTokenDistroBalance(regenStreamConfig.tokenDistroAddress)
		: sdh.getGIVTokenDistroBalance();
	const givback = useMemo<ethers.BigNumber>(
		() => BN(tokenDistroBalance.givback),
		[tokenDistroBalance],
	);
	const givbackLiquidPart = useMemo<ethers.BigNumber>(
		() => BN(tokenDistroBalance.givbackLiquidPart),
		[tokenDistroBalance],
	);

	const tokenPrice = useMemo(() => {
		const currentPrice =
			network === config.MAINNET_NETWORK_NUMBER
				? mainnetThirdPartyTokensPrice
				: xDaiThirdPartyTokensPrice;
		const price = regenStreamConfig
			? currentPrice[regenStreamConfig.tokenAddressOnUniswapV2]
			: givPrice;
		return new BigNumber(price);
	}, [givPrice, network, regenStreamConfig]);

	useEffect(() => {
		if (!tokenDistroHelper) return;
		if (earned) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(earned));
			setEarnedStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(earned),
			);
		}
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
	}, [
		earned,
		tokenDistroBalance,
		tokenDistroHelper,
		givback,
		regenStreamConfig,
	]);

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
			network === config.XDAI_NETWORK_NUMBER &&
			!tokenDistroBalance.givDropClaimed &&
			account
		) {
			fetchAirDropClaimData(account).then(claimData => {
				if (claimData) {
					const givDrop = ethers.BigNumber.from(claimData.amount);
					setGIVdrop(givDrop.div(10));
					setGIVdropStream(
						tokenDistroHelper.getStreamPartTokenPerWeek(givDrop),
					);
				}
			});
		}
	}, [
		account,
		network,
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
					state === HarvestStates.HARVESTING) &&
					(sumLiquid.isZero() ? (
						<>
							<NothingToHarvest>
								You have nothing to claim
							</NothingToHarvest>
							<CancelButton
								disabled={state !== HarvestStates.HARVEST}
								label='OK'
								size='large'
								onClick={closeModal}
							/>
						</>
					) : (
						<>
							<HarvestBoxes>
								{sumLiquid && sumLiquid.gt(0) && (
									<>
										<AmountBoxWithPrice
											amount={sumLiquid}
											price={calcUSD(
												formatWeiHelper(
													sumLiquid,
													config.TOKEN_PRECISION,
													false,
												),
											)}
											tokenSymbol={
												regenStreamConfig?.rewardTokenSymbol
											}
										/>
										<HelpRow alignItems='baseline' wrap={1}>
											<Caption>
												Your new {tokenSymbol}
												stream flowrate
											</Caption>
											<IconWithTooltip
												icon={
													<IconHelpFilled16
														color={
															brandColors
																.deep[100]
														}
													/>
												}
												direction={'top'}
											>
												<TooltipContent>
													Increase your {tokenSymbol}
													stream flowrate when you
													claim liquid rewards!
												</TooltipContent>
											</IconWithTooltip>
											<Flex gap='8px'>
												<IconGIVStream size={24} />
												<GIVRate>
													{formatWeiHelper(sumStream)}
												</GIVRate>
												<Lead>{tokenSymbol}/week</Lead>
											</Flex>
										</HelpRow>
									</>
								)}
								<HarvestAllDesc>
									When you harvest {tokenSymbol}
									rewards, all liquid {tokenSymbol} allocated
									to you on that chain is sent to your wallet.
									Your {tokenSymbol}stream flowrate may also
									increase. Below is the breakdown of rewards
									you will get when you harvest.
								</HarvestAllDesc>
								<BreakdownTableTitle>
									Rewards breakdown
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
												earnedLiquid.sub(
													givbackLiquidPart,
												),
												config.TOKEN_PRECISION,
												false,
											)}
										</BreakdownAmount>
										<BreakdownUnit>
											{tokenSymbol}
										</BreakdownUnit>
										<BreakdownRate>
											{formatWeiHelper(
												rewardStream.minus(
													givBackStream,
												),
												config.TOKEN_PRECISION,
												false,
											)}
										</BreakdownRate>
										<BreakdownUnit>
											{tokenSymbol}/week
										</BreakdownUnit>
										{givBackStream != 0 && (
											<>
												<GIVbackStreamDesc>
													Recieved from GIVbacks
												</GIVbackStreamDesc>
												<BreakdownRate>
													{formatWeiHelper(
														givBackStream,
														config.TOKEN_PRECISION,
														false,
													)}
												</BreakdownRate>
												<BreakdownUnit>
													{tokenSymbol}/week
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
															Your GIVstream
															flowrate was
															automatically
															increased when
															GIVbacks were
															distributed.
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
												{formatWeiHelper(
													givbackLiquidPart,
													config.TOKEN_PRECISION,
													false,
												)}
											</BreakdownAmount>
											<BreakdownUnit>
												{tokenSymbol}
											</BreakdownUnit>
											<BreakdownRate></BreakdownRate>
											<BreakdownUnit></BreakdownUnit>
										</BreakdownRow>
									)}
									{poolStakingConfig &&
										earned &&
										earned.gt(0) && (
											<BreakdownRow>
												<BreakdownTitle>
													<BreakdownIcon>
														<IconGIVFarm
															size={24}
														/>
													</BreakdownIcon>
													<P>
														{regenStreamConfig
															? 'RegenFarm'
															: 'GIVfarm'}
													</P>
													{poolStakingConfig.title}
													<PoolIcon>
														{getPoolIconWithName(
															poolStakingConfig.platform,
														)}
													</PoolIcon>
												</BreakdownTitle>
												<BreakdownAmount>
													{formatWeiHelper(
														rewardLiquidPart,
														config.TOKEN_PRECISION,
														false,
													)}
												</BreakdownAmount>
												<BreakdownUnit>
													{tokenSymbol}
												</BreakdownUnit>
												<BreakdownRate>
													+
													{formatWeiHelper(
														earnedStream,
														config.TOKEN_PRECISION,
														false,
													)}
												</BreakdownRate>
												<BreakdownUnit>
													{tokenSymbol}/week
												</BreakdownUnit>
											</BreakdownRow>
										)}
									<BreakdownSumRow>
										<div></div>
										<BreakdownLiquidSum>
											{formatWeiHelper(
												sumLiquid,
												config.TOKEN_PRECISION,
												false,
											)}
										</BreakdownLiquidSum>
										<BreakdownUnit>
											{tokenSymbol}
										</BreakdownUnit>
										<BreakdownStreamSum>
											<IconGIVStream size={24} />
											<P>
												{formatWeiHelper(
													sumStream,
													config.TOKEN_PRECISION,
													false,
												)}
											</P>
										</BreakdownStreamSum>
										<BreakdownUnit>
											{tokenSymbol}/week
										</BreakdownUnit>
									</BreakdownSumRow>
								</BreakdownTableBody>

								{state === HarvestStates.HARVEST && (
									<HarvestButton
										label='HARVEST'
										size='medium'
										buttonType='primary'
										onClick={onHarvest}
									/>
								)}
								{state === HarvestStates.HARVESTING && (
									<HarvestAllPending>
										<LottieControl
											animationData={LoadingAnimation}
											size='40'
										/>
										&nbsp;HARVEST PENDING
									</HarvestAllPending>
								)}
								<CancelButton
									disabled={state !== HarvestStates.HARVEST}
									label='CANCEL'
									size='medium'
									buttonType='texty'
									onClick={closeModal}
								/>
							</HarvestBoxes>
						</>
					))}
				{state === HarvestStates.SUBMITTED && (
					<SubmittedInnerModal
						title={title}
						walletNetwork={network}
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
						walletNetwork={network}
						txHash={txHash}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
					/>
				)}
				{state === HarvestStates.ERROR && (
					<ErrorInnerModal
						title='Something went wrong!'
						walletNetwork={network}
						txHash={txHash}
					/>
				)}
			</HarvestAllModalContainer>
		</Modal>
	);
};
