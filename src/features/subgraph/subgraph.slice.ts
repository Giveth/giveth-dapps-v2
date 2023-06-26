import { createSlice } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchCurrentInfoAsync,
	fetchMainnetInfoAsync,
	fetchGnosisInfoAsync,
	fetchOptimismInfoAsync,
} from './subgraph.thunks';
import type { ISubgraphState } from './subgraph.types';

export const defaultSubgraphValues: ISubgraphState = {
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	networkNumber: config.MAINNET_NETWORK_NUMBER,
	isLoaded: false,
};

export const defaultXdaiSubgraphValues: ISubgraphState = {
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	networkNumber: config.XDAI_NETWORK_NUMBER,
	isLoaded: false,
};

const initialState: {
	currentValues: ISubgraphState;
	mainnetValues: ISubgraphState;
	gnosisValues: ISubgraphState;
	optimismValues: ISubgraphState;
} = {
	currentValues: defaultSubgraphValues,
	mainnetValues: defaultSubgraphValues,
	gnosisValues: defaultXdaiSubgraphValues,
	optimismValues: defaultSubgraphValues,
};

export const subgraphSlice = createSlice({
	name: 'subgraph',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCurrentInfoAsync.fulfilled, (state, action) => {
				state.currentValues = action.payload.response;
				if (action.payload.chainId === config.MAINNET_NETWORK_NUMBER) {
					state.mainnetValues = action.payload.response;
				} else if (
					action.payload.chainId === config.XDAI_NETWORK_NUMBER
				) {
					state.gnosisValues = action.payload.response;
				} else if (
					action.payload.chainId === config.OPTIMISM_NETWORK_NUMBER
				) {
					state.optimismValues = action.payload.response;
				}
			})
			.addCase(fetchMainnetInfoAsync.fulfilled, (state, action) => {
				state.mainnetValues = action.payload;
			})
			.addCase(fetchGnosisInfoAsync.fulfilled, (state, action) => {
				state.gnosisValues = action.payload;
			})
			.addCase(fetchOptimismInfoAsync.fulfilled, (state, action) => {
				state.optimismValues = action.payload;
			});
	},
});

// Action creators are generated for each case reducer function
// export const {} = subgraphSlice.actions;

export default subgraphSlice.reducer;
