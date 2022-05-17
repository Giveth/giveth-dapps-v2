import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
	status: 'idle',
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
		return defaultSubgraphValue;
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
		return defaultSubgraphValue;
	}
};

export const fetchXDaiInfoAsync = createAsyncThunk(
	'subgraph/fetchXDaiInfo',
	async (userAddress: string) => {
		const response = await fetchXDaiInfo(userAddress);
		// The value we return becomes the `fulfilled` action payload
		console.log(response);
		return response;
	},
);

export const fetchMainnetInfoAsync = createAsyncThunk(
	'subgraph/fetchMainnetInfo',
	async (userAddress: string) => {
		const response = await fetchXDaiInfo(userAddress);
		// The value we return becomes the `fulfilled` action payload
		console.log(response);
		return response;
	},
);

interface ICurrentInfo {
	userAddress: string;
	chainId: number;
}

export const fetchCurrentInfoAsync = createAsyncThunk(
	'subgraph/fetchCurrentInfo',
	async (props: ICurrentInfo) => {
		const response =
			props.chainId === config.MAINNET_NETWORK_NUMBER
				? await fetchMainnetInfo(props.userAddress)
				: await fetchXDaiInfo(props.userAddress);
		// The value we return becomes the `fulfilled` action payload
		console.log(response);
		return { response, chainId: props.chainId };
	},
);

export const subgraphSlice = createSlice({
	name: 'subgraph',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCurrentInfoAsync.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchCurrentInfoAsync.fulfilled, (state, action) => {
				state.status = 'idle';
				state.currentValues = action.payload.response;
				if (action.payload.chainId === config.MAINNET_NETWORK_NUMBER) {
					state.mainnetValues = action.payload.response;
				}
				if (action.payload.chainId === config.XDAI_NETWORK_NUMBER) {
					state.xDaiValues = action.payload.response;
				}
			})
			.addCase(fetchCurrentInfoAsync.rejected, state => {
				state.status = 'failed';
			});
		builder
			.addCase(fetchXDaiInfoAsync.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchXDaiInfoAsync.fulfilled, (state, action) => {
				state.status = 'idle';
				state.xDaiValues = action.payload;
			})
			.addCase(fetchXDaiInfoAsync.rejected, state => {
				state.status = 'failed';
			});
		builder
			.addCase(fetchMainnetInfoAsync.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchMainnetInfoAsync.fulfilled, (state, action) => {
				state.status = 'idle';
				state.mainnetValues = action.payload;
			})
			.addCase(fetchMainnetInfoAsync.rejected, state => {
				state.status = 'failed';
			});
	},
});

// Action creators are generated for each case reducer function
// export const {} = subgraphSlice.actions;

export default subgraphSlice.reducer;
