import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { captureException } from '@sentry/nextjs';
import {
	IBalances,
	IInfinitePositionReward,
	ITokenDistroInfo,
	IUnipool,
	IUniswapV2Pair,
	IUniswapV3Pool,
	IUniswapV3Position,
	ZeroBalances,
} from '@/types/subgraph';
import { StakingType, StreamType, RegenFarmType } from '@/types/config';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';

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
	[RegenFarmType.FOX_HNY]?: IUnipool;
}

const defaultSubgraphValue: ISubgraphState = {
	balances: ZeroBalances,
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
};

const initialState = {
	currentValues: defaultSubgraphValue,
	mainnetValues: defaultSubgraphValue,
	xDaiValues: defaultSubgraphValue,
};

const fetchMainnetInfo = async (userAddress = '') => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getMainnetQuery(userAddress),
			config.MAINNET_NETWORK_NUMBER,
		);
		return transformSubgraphData(response);
	} catch (e) {
		console.error('Error on query mainnet subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchMainnetSubgraph',
			},
		});
	}
};

const fetchXDaiInfo = async (userAddress = '') => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getXDaiQuery(userAddress),
			config.XDAI_NETWORK_NUMBER,
		);
		return transformSubgraphData(response);
	} catch (e) {
		console.error('Error on query xDai subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchxDaiSubgraph',
			},
		});
	}
};

export const subgraphSlice = createSlice({
	name: 'subgraph',
	initialState,
	reducers: {
		log: state => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			// state.value += 1;
			console.log('state', state);
		},
		updateXDaiValues: state => {
			// state.value -= 1;
		},
		updateMainnetValues: (state, action: PayloadAction<string>) => {
			// state.value -= 1;
			state.mainnetValues = fetchMainnetInfo(action.payload);
		},
		incrementByAmount: (state, action: PayloadAction<number>) => {
			// state.value += action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { updateMainnetValues, updateXDaiValues, incrementByAmount } =
	subgraphSlice.actions;

export default subgraphSlice.reducer;
