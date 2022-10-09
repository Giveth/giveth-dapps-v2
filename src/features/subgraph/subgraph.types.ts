import {
	IUniswapV3Position,
	IInfinitePositionReward,
	IUnipool,
	ITokenDistro,
	IUnipoolBalance,
	ITokenDistroBalance,
	ITokenBalance,
	IUniswapV3Pool,
	IGIVpower,
} from '@/types/subgraph';

export interface ISubgraphState {
	[key: string]:
		| IUnipool
		| IUnipoolBalance
		| ITokenDistro
		| ITokenDistroBalance
		| ITokenBalance
		| IUniswapV3Pool
		| IUniswapV3Position[]
		| IInfinitePositionReward
		| IUniswapV3Position
		| IGIVpower
		| number
		| boolean;
}

export interface ICurrentInfo {
	userAddress?: string;
	chainId: number;
}
