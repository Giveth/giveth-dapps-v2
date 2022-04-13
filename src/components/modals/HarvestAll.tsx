import React, { FC, useEffect, useMemo, useState } from 'react';
import { IModal, Modal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '@/animations/loading.json';
import {
	B,
	brandColors,
	Caption,
	IconGIVBack,
	IconGIVFarm,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
} from '@giveth/ui-design-system';
import {
	PoolStakingConfig,
	RegenStreamConfig,
	StreamType,
} from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { formatWeiHelper } from '@/helpers/number';
import { useSubgraph } from '@/context/subgraph.context';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { harvestTokens } from '@/lib/stakingPool';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import { useLiquidityPositions } from '@/context';
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
	RateRow,
	SPTitle,
	StakingPoolLabel,
	StakingPoolSubtitle,
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
} from './HarvestAll.sc';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { claimReward, fetchAirDropClaimData } from '@/lib/claim';
import config from '@/configuration';
import { IconWithTooltip } from '../IconWithToolTip';
import { AmountBoxWithPrice } from '@/components/AmountBoxWithPrice';
import { usePrice } from '@/context/price.context';
import { useWeb3React } from '@web3-react/core';

interface IHarvestAllModalProps extends IModal {
	title: string;
	poolStakingConfig?: PoolStakingConfig;
	claimable?: ethers.BigNumber;
	network: number;
	regenStreamConfig?: RegenStreamConfig;
}

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

enum HarvestStates {
	HARVEST,
	HARVESTING,
	SUBMITTED,
	CONFIRMED,
	ERROR,
}

export const HarvestAllModal: FC<IHarvestAllModalProps> = ({
	title,
	showModal,
	setShowModal,
	poolStakingConfig,
	claimable,
	network,
	regenStreamConfig,
}) => {
	const [state, setState] = useState<HarvestStates>(HarvestStates.HARVEST);
	const tokenSymbol = regenStreamConfig?.rewardTokenSymbol || 'GIV';
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { getTokenDistroHelper } = useTokenDistro();
	const { givPrice, getTokenPrice } = usePrice();
	const { account, library } = useWeb3React();
	const { currentIncentive, stakedPositions } = useLiquidityPositions();
	const [txHash, setTxHash] = useState('');
	//GIVdrop
	const [givDrop, setGIVdrop] = useState(Zero);
	const [givDropStream, setGIVdropStream] = useState<BigNumber.Value>(0);
	//GIVstream
	const [rewardLiquidPart, setRewardLiquidPart] = useState(Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	//GIVfarm
	const [claimableNow, setClaimableNow] = useState(Zero);
	const [claimableStream, setClaimableStream] = useState<BigNumber.Value>(0);
	//GIVback
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	//Sum
	const [sumLiquid, setSumLiquid] = useState(Zero);
	const [sumStream, setSumStream] = useState<BigNumber.Value>(0);

	const tokenDistroHelper = useMemo(
		() => getTokenDistroHelper(regenStreamConfig?.type),
		[getTokenDistroHelper, regenStreamConfig],
	);
	const givback = useMemo<ethers.BigNumber>(() => {
		return regenStreamConfig ? Zero : balances.givback;
	}, [regenStreamConfig, balances.givback]);
	const givbackLiquidPart = useMemo<ethers.BigNumber>(() => {
		return regenStreamConfig ? Zero : balances.givbackLiquidPart;
	}, [regenStreamConfig, balances.givbackLiquidPart]);
	const tokenPrice = useMemo(() => {
		return regenStreamConfig
			? getTokenPrice(regenStreamConfig.tokenAddressOnUniswapV2, network)
			: givPrice;
	}, [getTokenPrice, givPrice, network, regenStreamConfig]);

	useEffect(() => {
		if (claimable) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(claimable));
			setRewardStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(claimable),
			);
		}
		setClaimableNow(tokenDistroHelper.getUserClaimableNow(balances));
		if (claimable) {
			setClaimableStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(claimable),
			);
		}
		let lockedAmount;
		if (regenStreamConfig) {
			switch (regenStreamConfig.type) {
				case StreamType.FOX:
					lockedAmount = balances.foxAllocatedTokens;
					break;
				default:
					lockedAmount = ethers.constants.Zero;
			}
		} else {
			lockedAmount = balances.allocatedTokens.sub(givback);
		}
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount),
		);
		setGivBackStream(tokenDistroHelper.getStreamPartTokenPerWeek(givback));
	}, [claimable, balances, tokenDistroHelper, givback]);

	useEffect(() => {
		let _sum = rewardLiquidPart.add(givbackLiquidPart);
		if (claimableNow) {
			_sum = _sum.add(claimableNow);
		}
		if (_sum.isZero()) {
		} else {
			setSumLiquid(_sum);
		}
	}, [rewardLiquidPart, givbackLiquidPart, claimableNow]);

	useEffect(() => {
		if (
			!regenStreamConfig &&
			network === config.XDAI_NETWORK_NUMBER &&
			!balances.givDropClaimed &&
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
		balances?.givDropClaimed,
		tokenDistroHelper,
		regenStreamConfig,
	]);

	const onHarvest = async () => {
		if (!library || !account) return;
		setState(HarvestStates.HARVESTING);
		try {
			if (poolStakingConfig) {
				if (
					poolStakingConfig.hasOwnProperty(
						'NFT_POSITIONS_MANAGER_ADDRESS',
					)
				) {
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
						poolStakingConfig.LM_ADDRESS,
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
		}
	};

	const streamName = regenStreamConfig ? 'RegenStream ' : 'GIVstream ';
	const modalTitle = regenStreamConfig ? 'RegenFarm Rewards' : title;

	const calcUSD = (amount: string) => {
		const price = tokenPrice || givPrice;
		return price.isNaN() ? '0' : price.times(amount).toFixed(2);
	};

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			headerTitle={modalTitle}
			headerTitlePosition={'left'}
		>
			<>
				{(state === HarvestStates.HARVEST ||
					state === HarvestStates.HARVESTING) &&
					(sumLiquid.isZero() ? (
						<HarvestAllModalContainer>
							<NothingToHarvest>
								You have nothing to claim
							</NothingToHarvest>
							<CancelButton
								disabled={state !== HarvestStates.HARVEST}
								label='OK'
								size='large'
								onClick={() => {
									setShowModal(false);
								}}
							/>
						</HarvestAllModalContainer>
					) : (
						<HarvestAllModalContainer>
							<HarvestBoxes>
								{poolStakingConfig && (
									<SPTitle alignItems='center' gap='16px'>
										<StakingPoolImages
											title={poolStakingConfig.title}
										/>
										<div>
											<StakingPoolLabel weight={900}>
												{poolStakingConfig.title}
											</StakingPoolLabel>
											<StakingPoolSubtitle>
												{poolStakingConfig.description}
											</StakingPoolSubtitle>
										</div>
									</SPTitle>
								)}
								{/* {claimable && claimable.gt(0) && (
									<>
										<AmountBoxWithPrice
											amount={rewardLiquidPart}
											price={calcUSD(
												formatWeiHelper(
													rewardLiquidPart,
													config.TOKEN_PRECISION,
													false,
												),
											)}
											tokenSymbol={
												regenStreamConfig?.rewardTokenSymbol
											}
										/>
										<HelpRow alignItems='center'>
											<Caption>
												Added to your {tokenSymbol}
												stream flowrate
											</Caption>
											<IconWithTooltip
												icon={
													<IconHelp
														size={16}
														color={
															brandColors
																.deep[100]
														}
													/>
												}
												direction={'top'}
											>
												<TooltipContent>
													Increase you {tokenSymbol}
													stream flowrate when you
													claim liquid rewards!
												</TooltipContent>
											</IconWithTooltip>
										</HelpRow>
										<RateRow alignItems='center'>
											<IconGIVStream size={24} />
											<GIVRate>
												{formatWeiHelper(rewardStream)}
											</GIVRate>
											<Lead>{tokenSymbol}/week</Lead>
										</RateRow>
									</>
								)}
								{givback.gt(0) && (
									<>
										<HelpRow alignItems='center'>
											<B>Claimable from GIVbacks</B>
										</HelpRow>
										<AmountBoxWithPrice
											amount={givbackLiquidPart}
											price={calcUSD(
												formatWeiHelper(
													givbackLiquidPart,
													config.TOKEN_PRECISION,
													false,
												),
											)}
											tokenSymbol={
												regenStreamConfig?.rewardTokenSymbol
											}
										/>
										<HelpRow alignItems='center'>
											<Caption>
												Added to your {tokenSymbol}
												stream flowrate
											</Caption>
											<IconWithTooltip
												icon={
													<IconHelp
														size={16}
														color={
															brandColors
																.deep[100]
														}
													/>
												}
												direction={'top'}
											>
												<TooltipContent>
													Increase you {tokenSymbol}
													stream flowrate when you
													claim liquid rewards!
												</TooltipContent>
											</IconWithTooltip>
										</HelpRow>
										<RateRow alignItems='center'>
											<IconGIVStream size={24} />
											<GIVRate>
												{formatWeiHelper(givBackStream)}
											</GIVRate>
											<Lead>{tokenSymbol}/week</Lead>
										</RateRow>
									</>
								)}
								{givDrop.gt(Zero) && (
									<>
										<HelpRow alignItems='center'>
											<B>Claimable from GIVdrop</B>
										</HelpRow>
										<AmountBoxWithPrice
											amount={givDrop}
											price={calcUSD(
												formatWeiHelper(
													givDrop,
													config.TOKEN_PRECISION,
													false,
												),
											)}
											tokenSymbol={
												regenStreamConfig?.rewardTokenSymbol
											}
										/>
										<HelpRow alignItems='center'>
											<Caption>
												Your initial {streamName}
												flowrate
											</Caption>
										</HelpRow>
										<RateRow alignItems='center'>
											<IconGIVStream size={24} />
											<GIVRate>
												{formatWeiHelper(givDropStream)}
											</GIVRate>
											<Lead>{tokenSymbol}/week</Lead>
										</RateRow>
									</>
								)}
								{!claimableNow.isZero() && (
									<>
										<HelpRow alignItems='center'>
											<B>
												Claimable from {tokenSymbol}
												stream
											</B>
										</HelpRow>
										<AmountBoxWithPrice
											amount={claimableNow.sub(
												givbackLiquidPart,
											)}
											price={calcUSD(
												formatWeiHelper(
													claimableNow,
													config.TOKEN_PRECISION,
													false,
												),
											)}
											tokenSymbol={
												regenStreamConfig?.rewardTokenSymbol
											}
										/>
									</>
								)} */}
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
										<HelpRow alignItems='center'>
											<Caption>
												Your new {tokenSymbol}
												stream flowrate
											</Caption>
											<IconWithTooltip
												icon={
													<IconHelp
														size={16}
														color={
															brandColors
																.deep[100]
														}
													/>
												}
												direction={'top'}
											>
												<TooltipContent>
													Increase you {tokenSymbol}
													stream flowrate when you
													claim liquid rewards!
												</TooltipContent>
											</IconWithTooltip>
											<IconGIVStream size={24} />
											<GIVRate>
												{formatWeiHelper(rewardStream)}
											</GIVRate>
											<Lead>{tokenSymbol}/week</Lead>
										</HelpRow>
									</>
								)}
								<HarvestAllDesc>
									When you harvest {tokenSymbol}
									rewards anywhere in the GIVeconomy, all
									liquid {tokenSymbol} allocated to you on
									that chain is sent to your wallet. Your{' '}
									{tokenSymbol}stream flowrate may also
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
												claimableNow.sub(
													givbackLiquidPart,
												),
												config.TOKEN_PRECISION,
												false,
											)}
											<BreakdownUnit>
												{tokenSymbol}
											</BreakdownUnit>
										</BreakdownAmount>
										<BreakdownRate>
											{formatWeiHelper(
												rewardStream,
												config.TOKEN_PRECISION,
												false,
											)}
											<BreakdownUnit>
												{tokenSymbol}/week
											</BreakdownUnit>
										</BreakdownRate>
									</BreakdownRow>
									{!regenStreamConfig && givback.gt(0) && (
										<BreakdownRow>
											<BreakdownTitle>
												<BreakdownIcon>
													<IconGIVBack size={24} />
												</BreakdownIcon>
												<P>GIVback</P>
											</BreakdownTitle>
											<BreakdownAmount>
												{formatWeiHelper(
													givbackLiquidPart,
													config.TOKEN_PRECISION,
													false,
												)}
												<BreakdownUnit>
													{tokenSymbol}
												</BreakdownUnit>
											</BreakdownAmount>
											<BreakdownRate>
												{formatWeiHelper(
													givBackStream,
													config.TOKEN_PRECISION,
													false,
												)}
												<BreakdownUnit>
													{tokenSymbol}/week
												</BreakdownUnit>
											</BreakdownRate>
										</BreakdownRow>
									)}
									{claimable && claimable.gt(0) && (
										<BreakdownRow>
											<BreakdownTitle>
												<BreakdownIcon>
													<IconGIVFarm size={24} />
												</BreakdownIcon>
												<P>
													{regenStreamConfig
														? 'RegenFarm'
														: 'GIVfarm'}
												</P>
											</BreakdownTitle>
											<BreakdownAmount>
												{formatWeiHelper(
													rewardLiquidPart,
													config.TOKEN_PRECISION,
													false,
												)}
												<BreakdownUnit>
													{tokenSymbol}
												</BreakdownUnit>
											</BreakdownAmount>
											<BreakdownRate>
												{formatWeiHelper(
													claimableStream,
													config.TOKEN_PRECISION,
													false,
												)}
												<BreakdownUnit>
													{tokenSymbol}/week
												</BreakdownUnit>
											</BreakdownRate>
										</BreakdownRow>
									)}
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
										<Lottie
											options={loadingAnimationOptions}
											height={40}
											width={40}
										/>
										&nbsp;HARVEST PENDING
									</HarvestAllPending>
								)}
								<CancelButton
									disabled={state !== HarvestStates.HARVEST}
									label='CANCEL'
									size='medium'
									buttonType='texty'
									onClick={() => {
										setShowModal(false);
									}}
								/>
							</HarvestBoxes>
						</HarvestAllModalContainer>
					))}
				{state === HarvestStates.SUBMITTED && (
					<HarvestAllModalContainer>
						<SubmittedInnerModal
							title={title}
							walletNetwork={network}
							txHash={txHash}
							rewardTokenSymbol={
								regenStreamConfig?.rewardTokenSymbol
							}
							rewardTokenAddress={
								regenStreamConfig?.rewardTokenAddress
							}
						/>
					</HarvestAllModalContainer>
				)}
				{state === HarvestStates.CONFIRMED && (
					<HarvestAllModalContainer>
						<ConfirmedInnerModal
							title={title}
							walletNetwork={network}
							txHash={txHash}
							rewardTokenSymbol={
								regenStreamConfig?.rewardTokenSymbol
							}
							rewardTokenAddress={
								regenStreamConfig?.rewardTokenAddress
							}
						/>
					</HarvestAllModalContainer>
				)}
				{state === HarvestStates.ERROR && (
					<HarvestAllModalContainer>
						<ErrorInnerModal
							title='Something went wrong!'
							walletNetwork={network}
							txHash={txHash}
						/>
					</HarvestAllModalContainer>
				)}
			</>
		</Modal>
	);
};
