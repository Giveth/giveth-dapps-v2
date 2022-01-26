import { constants, ethers } from 'ethers';

export interface IBalances {
	balance: ethers.BigNumber;
	allocatedTokens: ethers.BigNumber;
	claimed: ethers.BigNumber;
	rewardPerTokenPaidGivLm: ethers.BigNumber;
	rewardsGivLm: ethers.BigNumber;
	rewardPerTokenPaidSushiSwap: ethers.BigNumber;
	rewardsSushiSwap: ethers.BigNumber;
	rewardPerTokenPaidHoneyswap: ethers.BigNumber;
	rewardsHoneyswap: ethers.BigNumber;
	rewardPerTokenPaidUniswap: ethers.BigNumber;
	rewardsUniswap: ethers.BigNumber;
	rewardPerTokenPaidBalancer: ethers.BigNumber;
	rewardsBalancer: ethers.BigNumber;
	givback: ethers.BigNumber;
	givbackLiquidPart: ethers.BigNumber;
	balancerLp: ethers.BigNumber;
	balancerLpStaked: ethers.BigNumber;
	sushiswapLp: ethers.BigNumber;
	sushiSwapLpStaked: ethers.BigNumber;
	honeyswapLp: ethers.BigNumber;
	honeyswapLpStaked: ethers.BigNumber;
	givStaked: ethers.BigNumber;
	allocationCount: number;
	givDropClaimed: boolean;
}
export const ZeroBalances: IBalances = {
	balance: constants.Zero,
	allocatedTokens: constants.Zero,
	claimed: constants.Zero,
	rewardPerTokenPaidGivLm: constants.Zero,
	rewardsGivLm: constants.Zero,
	rewardPerTokenPaidSushiSwap: constants.Zero,
	rewardsSushiSwap: constants.Zero,
	rewardPerTokenPaidHoneyswap: constants.Zero,
	rewardsHoneyswap: constants.Zero,
	rewardPerTokenPaidUniswap: constants.Zero,
	rewardsUniswap: constants.Zero,
	rewardPerTokenPaidBalancer: constants.Zero,
	rewardsBalancer: constants.Zero,
	givback: constants.Zero,
	givbackLiquidPart: constants.Zero,
	balancerLp: constants.Zero,
	balancerLpStaked: constants.Zero,
	sushiswapLp: constants.Zero,
	sushiSwapLpStaked: constants.Zero,
	honeyswapLp: constants.Zero,
	honeyswapLpStaked: constants.Zero,
	givStaked: constants.Zero,
	allocationCount: 0,
	givDropClaimed: false,
};

export interface ITokenAllocation {
	amount: ethers.BigNumber;
	distributor: string;
	recipient: string;
	timestamp: string;
	txHash: string;
}

export interface ITokenDistroInfo {
	initialAmount: ethers.BigNumber;
	lockedAmount: ethers.BigNumber;
	totalTokens: ethers.BigNumber;
	startTime: Date;
	cliffTime: Date;
	endTime: Date;
}

export interface IUnipool {
	totalSupply: ethers.BigNumber;
	lastUpdateTime: Date;
	periodFinish: Date;
	rewardPerTokenStored: ethers.BigNumber;
	rewardRate: ethers.BigNumber;
}

export interface IUniswapV3Position {
	tokenId: number;
	token0: string;
	token1: string;
	liquidity: ethers.BigNumber;
	tickLower: number;
	tickUpper: number;
	owner: string;
	staker: string | null;
	staked: boolean;
}

export interface IUniswapV3Pool {
	token0: string;
	token1: string;
	sqrtPriceX96: ethers.BigNumber;
	tick: number;
	liquidity: ethers.BigNumber;
}

export interface IUniswapV2Pair {
	token0: string;
	token1: string;
	reserve0: ethers.BigNumber;
	reserve1: ethers.BigNumber;
}
