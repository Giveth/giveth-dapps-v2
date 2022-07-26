import {
	IUniswapV3Position,
	IInfinitePositionReward,
	IUnipool,
	ITokenDistro,
	IUnipoolBalance,
	ITokenDistroBalance,
	ITokenBalance,
	IUniswapV3Pool,
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
		| number;
}

export interface ICurrentInfo {
	userAddress: string;
	chainId: number;
}
