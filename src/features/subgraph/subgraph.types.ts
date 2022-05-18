import { StakingType, StreamType, RegenFarmType } from '@/types/config';
import {
	IBalances,
	ITokenDistroInfo,
	IUniswapV3Pool,
	IUnipool,
	IUniswapV3Position,
	IUniswapV2Pair,
	IInfinitePositionReward,
} from '@/types/subgraph';

export interface ISubgraphState {
	balances: IBalances;
	tokenDistroInfo?: ITokenDistroInfo;
	uniswapV3Pool?: IUniswapV3Pool;
	[StakingType.GIV_LM]?: IUnipool;
	[StakingType.BALANCER]?: IUnipool;
	[StakingType.SUSHISWAP]?: IUnipool;
	[StakingType.HONEYSWAP]?: IUnipool;
	[StakingType.UNISWAPV2]?: IUnipool;
	[StakingType.UNISWAPV3]?: IUnipool;
	userNotStakedPositions: IUniswapV3Position[];
	userStakedPositions: IUniswapV3Position[];
	allPositions: IUniswapV3Position[];
	uniswapV2EthGivPair?: IUniswapV2Pair;
	infinitePositionReward?: IInfinitePositionReward;
	infinitePosition?: IUniswapV3Position;
	[StreamType.FOX]?: ITokenDistroInfo;
	[StreamType.CULT]?: ITokenDistroInfo;
	[RegenFarmType.FOX_HNY]?: IUnipool;
	[RegenFarmType.CULT_ETH]?: IUnipool;
}

export interface ICurrentInfo {
	userAddress: string;
	chainId: number;
}
