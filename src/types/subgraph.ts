export interface IBalances {
	balance: string;
	allocatedTokens: string;
	claimed: string;
	rewardPerTokenPaidGivLm: string;
	rewardsGivLm: string;
	rewardPerTokenPaidSushiSwap: string;
	rewardsSushiSwap: string;
	rewardPerTokenPaidHoneyswap: string;
	rewardsHoneyswap: string;
	rewardPerTokenPaidHoneyswapGivDai: string;
	rewardsHoneyswapGivDai: string;
	rewardPerTokenPaidBalancer: string;
	rewardsBalancer: string;
	rewardPerTokenPaidUniswapV2GivDai: string;
	rewardsUniswapV2GivDai: string;
	givback: string;
	givbackLiquidPart: string;
	balancerLp: string;
	balancerLpStaked: string;
	uniswapV2GivDaiLp: string;
	uniswapV2GivDaiLpStaked: string;
	sushiswapLp: string;
	sushiSwapLpStaked: string;
	honeyswapLp: string;
	honeyswapLpStaked: string;
	honeyswapGivDaiLp: string;
	honeyswapGivDaiLpStaked: string;
	givStaked: string;
	allocationCount: number;
	givDropClaimed: boolean;

	foxAllocatedTokens: string;
	foxClaimed: string;
	rewardPerTokenPaidFoxHnyLm: string;
	rewardsFoxHnyLm: string;
	foxHnyLp: string;
	foxHnyLpStaked: string;

	cultAllocatedTokens: string;
	cultClaimed: string;
	rewardPerTokenPaidCultEthLm: string;
	rewardsCultEthLm: string;
	cultEthLpStaked: string;
	cultEthLp: string;
}
export const ZeroBalances: IBalances = {
	balance: '0',
	allocatedTokens: '0',
	claimed: '0',
	rewardPerTokenPaidGivLm: '0',
	rewardsGivLm: '0',
	rewardPerTokenPaidSushiSwap: '0',
	rewardsSushiSwap: '0',
	rewardPerTokenPaidHoneyswap: '0',
	rewardsHoneyswap: '0',
	rewardPerTokenPaidHoneyswapGivDai: '0',
	rewardsHoneyswapGivDai: '0',
	rewardPerTokenPaidBalancer: '0',
	rewardsBalancer: '0',
	rewardPerTokenPaidUniswapV2GivDai: '0',
	rewardsUniswapV2GivDai: '0',
	givback: '0',
	givbackLiquidPart: '0',
	balancerLp: '0',
	balancerLpStaked: '0',
	uniswapV2GivDaiLp: '0',
	uniswapV2GivDaiLpStaked: '0',
	sushiswapLp: '0',
	sushiSwapLpStaked: '0',
	honeyswapLp: '0',
	honeyswapLpStaked: '0',
	honeyswapGivDaiLp: '0',
	honeyswapGivDaiLpStaked: '0',
	givStaked: '0',
	allocationCount: 0,
	givDropClaimed: false,

	foxAllocatedTokens: '0',
	foxClaimed: '0',
	rewardPerTokenPaidFoxHnyLm: '0',
	rewardsFoxHnyLm: '0',
	foxHnyLp: '0',
	foxHnyLpStaked: '0',

	cultAllocatedTokens: '0',
	cultClaimed: '0',
	rewardPerTokenPaidCultEthLm: '0',
	rewardsCultEthLm: '0',
	cultEthLpStaked: '0',
	cultEthLp: '0',
};

export interface ITokenAllocation {
	amount: string;
	distributor: string;
	recipient: string;
	timestamp: string;
	txHash: string;
}

export interface ITokenDistroInfo {
	contractAddress: string;
	initialAmount: string;
	lockedAmount: string;
	totalTokens: string;
	startTime: number;
	cliffTime: number;
	endTime: number;
}

export interface IUnipool {
	totalSupply: string;
	lastUpdateTime: number;
	periodFinish: number;
	rewardPerTokenStored: string;
	rewardRate: string;
}

export interface IGIVPowers {
	id: string;
	initialDate: number;
	locksCreated: number;
	roundDuration: number;
	totalGIVPower: string;
	totalGIVLocked: string;
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
