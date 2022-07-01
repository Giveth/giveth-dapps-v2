import { ethers } from 'ethers';
import {
	IBalances,
	IGIVpowerInfo,
	IInfinitePositionReward,
	ITokenDistroInfo,
	IUnipool,
	IUniswapV2Pair,
	IUniswapV3Pool,
	IUniswapV3Position,
	ZeroBalances,
} from '@/types/subgraph';
import { RegenFarmType, StakingType, StreamType } from '@/types/config';
import { getGIVpowerRoundsInfo } from '@/helpers/givpower';
import type { ISubgraphState } from '@/features/subgraph/subgraph.types';

const transformBalanceInfo = (info: any, gGiv: any): IBalances => {
	if (!info) return ZeroBalances;

	const balance = info.balance || 0;
	const allocatedTokens = info.allocatedTokens || 0;
	const claimed = info.claimed || 0;
	const rewardPerTokenPaidGivLm = info.rewardPerTokenPaidGivLm || 0;
	const rewardsGivLm = info.rewardsGivLm || 0;
	const rewardPerTokenPaidSushiSwap = info.rewardPerTokenPaidSushiSwap || 0;
	const rewardsSushiSwap = info.rewardsSushiSwap || 0;
	const rewardPerTokenPaidHoneyswap = info.rewardPerTokenPaidHoneyswap || 0;
	const rewardsHoneyswap = info.rewardsHoneyswap || 0;
	const rewardPerTokenPaidHoneyswapGivDai =
		info.rewardPerTokenPaidHoneyswapGivDai || 0;
	const rewardsHoneyswapGivDai = info.rewardsHoneyswapGivDai || 0;
	const rewardPerTokenPaidBalancer = info.rewardPerTokenPaidBalancer || 0;
	const rewardsBalancer = info.rewardsBalancer || 0;
	const rewardPerTokenPaidUniswapV2GivDai =
		info.rewardPerTokenPaidUniswapV2GivDai || 0;
	const rewardsUniswapV2GivDai = info.rewardsUniswapV2GivDai || 0;
	const givback = info.givback || 0;
	const givbackLiquidPart = info.givbackLiquidPart || 0;
	const balancerLp = info.balancerLp || 0;
	const balancerLpStaked = info.balancerLpStaked || 0;
	const uniswapV2GivDaiLp = info.uniswapV2GivDaiLp || 0;
	const uniswapV2GivDaiLpStaked = info.uniswapV2GivDaiLpStaked || 0;
	const sushiswapLp = info.sushiswapLp || 0;
	const sushiSwapLpStaked = info.sushiSwapLpStaked || 0;
	const honeyswapLp = info.honeyswapLp || 0;
	const honeyswapLpStaked = info.honeyswapLpStaked || 0;
	const honeyswapGivDaiLp = info.honeyswapGivDaiLp || 0;
	const honeyswapGivDaiLpStaked = info.honeyswapGivDaiLpStaked || 0;
	const givStaked = gGiv?.balance || 0;
	const allocationCount = Number(info.allocationCount || 0);
	const givDropClaimed = Boolean(info.givDropClaimed);

	const foxAllocatedTokens = info.foxAllocatedTokens || 0;
	const foxClaimed = info.foxClaimed || 0;
	const rewardPerTokenPaidFoxHnyLm = info.rewardPerTokenPaidFoxHnyLm || 0;
	const rewardsFoxHnyLm = info.rewardsFoxHnyLm || 0;
	const foxHnyLp = info.foxHnyLp || 0;
	const foxHnyLpStaked = info.foxHnyLpStaked || 0;

	const cultAllocatedTokens = info.cultAllocatedTokens || 0;
	const cultClaimed = info.cultClaimed || 0;
	const rewardPerTokenPaidCultEthLm = info.rewardPerTokenPaidCultEthLm || 0;
	const rewardsCultEthLm = info.rewardsCultEthLm || 0;
	const cultEthLp = info.cultEthLp || 0;
	const cultEthLpStaked = info.cultEthLpStaked || 0;

	return {
		balance,
		allocatedTokens,
		claimed,
		rewardPerTokenPaidGivLm,
		rewardsGivLm,
		rewardPerTokenPaidSushiSwap,
		rewardsSushiSwap,
		rewardPerTokenPaidHoneyswap,
		rewardsHoneyswap,
		rewardPerTokenPaidHoneyswapGivDai,
		rewardsHoneyswapGivDai,
		rewardPerTokenPaidBalancer,
		rewardsBalancer,
		rewardPerTokenPaidUniswapV2GivDai,
		rewardsUniswapV2GivDai,
		givback,
		givbackLiquidPart,
		balancerLp,
		balancerLpStaked,
		uniswapV2GivDaiLp,
		uniswapV2GivDaiLpStaked,
		sushiswapLp,
		sushiSwapLpStaked,
		honeyswapLp,
		honeyswapLpStaked,
		honeyswapGivDaiLp,
		honeyswapGivDaiLpStaked,
		givStaked,
		allocationCount,
		givDropClaimed,

		foxAllocatedTokens,
		foxClaimed,
		rewardPerTokenPaidFoxHnyLm,
		rewardsFoxHnyLm,
		foxHnyLp,
		foxHnyLpStaked,

		cultAllocatedTokens,
		cultClaimed,
		rewardPerTokenPaidCultEthLm,
		rewardsCultEthLm,
		cultEthLp,
		cultEthLpStaked,
	};
};

const transformTokenDistroInfo = (info: any): ITokenDistroInfo | undefined => {
	if (!info) return undefined;

	const _startTime = info.startTime;
	const _cliffTime = info.cliffTime;
	const _duration = info.duration;

	const startTime = +(_startTime.toString() + '000');
	const cliffTime = +(_cliffTime.toString() + '000');
	const duration = +(_duration.toString() + '000');

	const endTime = startTime + duration;
	const initialAmount = info.initialAmount;
	const lockedAmount = info.lockedAmount;
	const totalTokens = info.totalTokens;

	return {
		contractAddress: info.id,
		initialAmount,
		lockedAmount,
		totalTokens,
		startTime,
		cliffTime,
		endTime,
	};
};

const transformUniswapV3Pool = (info: any): IUniswapV3Pool | undefined => {
	if (!info) return undefined;
	const sqrtPriceX96 = info.sqrtPriceX96;
	const tick = Number(info.tick);
	const liquidity = info.liquidity;
	const token0 = info.token0;
	const token1 = info.token1;
	return {
		token0,
		token1,
		sqrtPriceX96,
		tick,
		liquidity,
	};
};

const transformUnipoolInfo = (info: any): IUnipool | undefined => {
	if (!info) return undefined;

	const _lastUpdateTime = info?.lastUpdateTime || '0';
	const _periodFinish = info?.periodFinish || '0';

	const totalSupply = info?.totalSupply || 0;
	const rewardPerTokenStored = info?.rewardPerTokenStored || 0;
	const rewardRate = info?.rewardRate || 0;
	const lastUpdateTime = Number(_lastUpdateTime) * 1000;
	const periodFinish = Number(_periodFinish) * 1000;

	return {
		totalSupply,
		rewardPerTokenStored,
		rewardRate,
		lastUpdateTime,
		periodFinish,
	};
};

const transformUniswapPositions = (info: any): any => {
	if (!info) return {};
	const mapper = (info: any): IUniswapV3Position => {
		const tokenId = Number(info?.tokenId || 0);
		const liquidity = info?.liquidity;
		const tickLower = Number(info?.tickLower);
		const tickUpper = Number(info?.tickUpper);
		const staked = Boolean(info?.staked);
		const token0 = info?.token0;
		const token1 = info?.token1;
		return {
			tokenId,
			token0,
			token1,
			liquidity,
			tickLower,
			tickUpper,
			owner: info.owner,
			staked,
			staker: info.staker,
		};
	};

	const {
		userStakedPositions,
		allPositions,
		userNotStakedPositions,
		infinitePositionRewardInfo,
		infinitePositionInfo,
	} = info;

	const stakedInfo = {
		userStakedPositions: userStakedPositions
			? userStakedPositions.map(mapper)
			: [],
		userNotStakedPositions: userNotStakedPositions
			? userNotStakedPositions.map(mapper)
			: [],
		allPositions: allPositions ? allPositions.map(mapper) : [],
	};

	if (infinitePositionRewardInfo && infinitePositionInfo) {
		const infinitePositionReward: IInfinitePositionReward = {
			lastRewardAmount: infinitePositionRewardInfo.lastRewardAmount,
			lastUpdateTimeStamp: Number(
				infinitePositionRewardInfo.lastUpdateTimeStamp,
			),
		};
		const infinitePosition = mapper(infinitePositionInfo);
		return {
			...stakedInfo,
			infinitePositionReward,
			infinitePosition,
		};
	}

	return stakedInfo;
};

const transformUniswapV2Pair = (info: any): IUniswapV2Pair | undefined => {
	if (!info) return undefined;
	const token0 = info?.token0 || ethers.constants.AddressZero;
	const token1 = info?.token1 || ethers.constants.AddressZero;

	const reserve0 = info?.reserve0 || 1;
	const reserve1 = info?.reserve1 || 1;

	return {
		token0,
		token1,
		reserve0,
		reserve1,
	};
};

const transformGIVpowerInfo = (info: any): IGIVpowerInfo | undefined => {
	if (!info) return undefined;
	const id = info.id;
	const initialDate = info.initialDate;
	const locksCreated = info.locksCreated;
	const totalGIVLocked = info.totalGIVLocked;
	const roundDuration = info.roundDuration;
	const roundsInfo = getGIVpowerRoundsInfo(
		Number(info.initialDate),
		Number(info.roundDuration),
	);
	const nextRoundDate = roundsInfo.nextRoundDate;
	const currentRound = roundsInfo.currentRound;
	return {
		currentRound,
		id,
		initialDate,
		locksCreated,
		nextRoundDate,
		roundDuration,
		totalGIVLocked,
	};
};

export const transformSubgraphData = (data: any = {}): ISubgraphState => {
	return {
		balances: transformBalanceInfo(data?.balances, data?.gGiv[0]),
		tokenDistroInfo: transformTokenDistroInfo(data?.tokenDistroInfo),
		[StreamType.FOX]: transformTokenDistroInfo(data[StreamType.FOX]),
		[StreamType.CULT]: transformTokenDistroInfo(data[StreamType.CULT]),

		[StakingType.GIV_LM]: transformUnipoolInfo(data[StakingType.GIV_LM]),
		[StakingType.BALANCER_ETH_GIV]: transformUnipoolInfo(
			data[StakingType.BALANCER_ETH_GIV],
		),
		[StakingType.UNISWAPV2_GIV_DAI]: transformUnipoolInfo(
			data[StakingType.UNISWAPV2_GIV_DAI],
		),
		[StakingType.HONEYSWAP_GIV_HNY]: transformUnipoolInfo(
			data[StakingType.HONEYSWAP_GIV_HNY],
		),
		[StakingType.HONEYSWAP_GIV_DAI]: transformUnipoolInfo(
			data[StakingType.HONEYSWAP_GIV_DAI],
		),
		[StakingType.SUSHISWAP_ETH_GIV]: transformUnipoolInfo(
			data[StakingType.SUSHISWAP_ETH_GIV],
		),
		[RegenFarmType.FOX_HNY]: transformUnipoolInfo(
			data[RegenFarmType.FOX_HNY],
		),
		[RegenFarmType.CULT_ETH]: transformUnipoolInfo(
			data[RegenFarmType.CULT_ETH],
		),

		uniswapV3Pool: transformUniswapV3Pool(data?.uniswapV3Pool),
		...transformUniswapPositions(data),
		uniswapV2EthGivPair: transformUniswapV2Pair(data?.uniswapV2EthGivPair),
		givpowerInfo: transformGIVpowerInfo(data?.givpowerInfo[0]),
		GIVPowerPositions: data?.GIVPowerPositions,
	};
};
