import { ethers } from 'ethers';
import {
	IInfinitePositionReward,
	ITokenBalance,
	ITokenDistroBalance,
	ITokenDistro,
	IUnipool,
	IUnipoolBalance,
	IUniswapV2Pair,
	IUniswapV3Pool,
	IUniswapV3Position,
	IGIVpower,
} from '@/types/subgraph';
import config from '@/configuration';
import { getGIVpowerRoundsInfo } from '@/helpers/givpower';
import type { ISubgraphState } from '@/features/subgraph/subgraph.types';

export const transformTokenDistro = (info: any = {}): ITokenDistro => {
	const _startTime = info?.startTime || '0';
	const _cliffTime = info?.cliffTime || '0';
	const _duration = info?.duration || '0';

	const startTime = +(_startTime.toString() + '000');
	const cliffTime = +(_cliffTime.toString() + '000');
	const duration = +(_duration.toString() + '000');

	const endTime = startTime + duration;
	const initialAmount = info?.initialAmount || '0';
	const lockedAmount = info?.lockedAmount || '0';
	const totalTokens = info?.totalTokens || '0';

	return {
		contractAddress: info?.id || ethers.constants.AddressZero,
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

export const transformUnipool = (info: any = {}): IUnipool => {
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

export const transformTokenBalance = (info: any = {}): ITokenBalance => {
	return {
		balance: info?.balance || '0',
	};
};

export const transformUnipoolBalance = (info: any = {}): IUnipoolBalance => {
	return {
		balance: info?.balance || '0',
		rewards: info?.rewards || '0',
		rewardPerTokenPaid: info?.rewardPerTokenPaid || '0',
	};
};

export const transformTokenDistroBalance = (info: any): ITokenDistroBalance => {
	return {
		allocatedTokens: info?.allocatedTokens || '0',
		allocationCount: info?.allocationCount || '0',
		claimed: info?.claimed || '0',
		givback: info?.givback || '0',
		givDropClaimed: Boolean(info?.givDropClaimed),
		givbackLiquidPart: info?.givbackLiquidPart || '0',
		tokenDistroAddress: info?.tokenDistroAddress || '0',
	};
};

const transformGIVpowerInfo = (info: any = {}): IGIVpower => {
	const id = info.id || '';
	const initialDate = info.initialDate || '0';
	const locksCreated = Number(info.locksCreated || 0);
	const totalGIVLocked = info.totalGIVLocked || '0';
	const roundDuration = Number(info.roundDuration || 0);
	return {
		id,
		initialDate,
		locksCreated,
		roundDuration,
		totalGIVLocked,
		...getGIVpowerRoundsInfo(initialDate, roundDuration),
	};
};

export const transformUserGIVLocked = (info: any = {}): ITokenBalance => {
	return {
		balance: info?.givLocked || '0',
	};
};

export const transformSubgraphData = (data: any = {}): ISubgraphState => {
	const result: ISubgraphState = {};
	Object.entries(data).forEach(([key, value]) => {
		switch (true) {
			case key.startsWith('tokenBalance_'):
				result[key] = transformTokenBalance(value);
				break;

			case key.startsWith('unipool_'):
				result[key] = transformUnipool(value);
				break;

			case key.startsWith('unipoolBalance_'):
				result[key] = transformUnipoolBalance(value);
				break;

			case key.startsWith('tokenDistro_'):
				result[key] = transformTokenDistro(value);
				break;

			case key.startsWith('tokenDistroBalance_'):
				result[key] = transformTokenDistroBalance(value);
				break;
			case key === 'givpowerInfo':
				result[key] = transformGIVpowerInfo(value);
				break;

			case key === 'userGIVLocked':
				result[key] = transformUserGIVLocked(value);
				break;

			default:
		}
	});
	return {
		...result,
		uniswapV3Pool: transformUniswapV3Pool(data?.uniswapV3Pool),
		...transformUniswapPositions(data),
		networkNumber: data?.networkNumber || config.MAINNET_NETWORK_NUMBER,
	};
};
