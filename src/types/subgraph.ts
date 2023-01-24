import { IUser } from '@/apollo/types/types';

export interface ITokenAllocation {
	amount: string;
	distributor: string;
	recipient: string;
	timestamp: string;
	txHash: string;
}

export interface ITokenDistro {
	contractAddress: string;
	initialAmount: string;
	lockedAmount: string;
	totalTokens: string;
	startTime: number;
	cliffTime: number;
	endTime: number;
}

export interface IGIVpower {
	id: string;
	initialDate: string;
	locksCreated: number;
	roundDuration: number;
	totalGIVLocked: string;
	currentRound: number;
	nextRoundDate: string;
}

export interface IGIVpowerPosition {
	id: string;
	user: IUser;
	amount: string;
	rounds: number;
	untilRound: number;
	unlockableAt: string;
	unlockedAt: string;
	unlocked: boolean;
}

export interface IUnipool {
	totalSupply: string;
	lastUpdateTime: number;
	periodFinish: number;
	rewardPerTokenStored: string;
	rewardRate: string;
}

export interface IUniswapV3Position {
	tokenId: number;
	token0: string;
	token1: string;
	liquidity: string;
	tickLower: number;
	tickUpper: number;
	owner: string;
	staker: string | null;
	staked: boolean;
}

export interface IInfinitePositionReward {
	lastRewardAmount: string;
	lastUpdateTimeStamp: number;
}

export interface IUniswapV3Pool {
	token0: string;
	token1: string;
	sqrtPriceX96: string;
	tick: number;
	liquidity: string;
}

export interface IUniswapV2Pair {
	token0: string;
	token1: string;
	reserve0: string;
	reserve1: string;
}

export interface ITokenBalance {
	balance: string;
}

export interface IUnipoolBalance {
	balance: string;
	rewards: string;
	rewardPerTokenPaid: string;
}

export interface ITokenDistroBalance {
	allocatedTokens: string;
	allocationCount: string;
	claimed: string;
	givback: string;
	givDropClaimed: boolean;
	givbackLiquidPart: string;
	tokenDistroAddress: string;
}
