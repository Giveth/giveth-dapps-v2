import { StakingType, StreamType, RegenFarmType } from '@/types/config';
import {
	IBalances,
	ITokenDistroInfo,
	IUniswapV3Pool,
	IUnipool,
	IUniswapV3Position,
	IUniswapV2Pair,
	IInfinitePositionReward,
	IGIVpower,
} from '@/types/subgraph';

export interface ISubgraphState {
	balances: IBalances;
	tokenDistroInfo?: ITokenDistroInfo;
	uniswapV3Pool?: IUniswapV3Pool;
	[StakingType.GIV_LM]?: IUnipool;
	[StakingType.GIVPOWER]?: IUnipool;
	[StakingType.BALANCER_ETH_GIV]?: IUnipool;
	[StakingType.SUSHISWAP_ETH_GIV]?: IUnipool;
	[StakingType.HONEYSWAP_GIV_HNY]?: IUnipool;
	[StakingType.HONEYSWAP_GIV_DAI]?: IUnipool;
	[StakingType.UNISWAPV2_GIV_DAI]?: IUnipool;
	[StakingType.UNISWAPV3_ETH_GIV]?: IUnipool;
	[StakingType.HONEYSWAP_FOX_HNY]?: IUnipool;
	[StakingType.UNISWAPV2_CULT_ETH]?: IUnipool;

	userNotStakedPositions: IUniswapV3Position[];
	userStakedPositions: IUniswapV3Position[];
	allPositions: IUniswapV3Position[];
	uniswapV2EthGivPair?: IUniswapV2Pair;
	infinitePositionReward?: IInfinitePositionReward;
	infinitePosition?: IUniswapV3Position;
	GIVPowerPositions?: IGIVpower;

	[StreamType.FOX]?: ITokenDistroInfo;
	[StreamType.CULT]?: ITokenDistroInfo;
	[RegenFarmType.FOX_HNY]?: IUnipool;
	[RegenFarmType.CULT_ETH]?: IUnipool;
}

export interface ICurrentInfo {
	userAddress: string;
	chainId: number;
}
