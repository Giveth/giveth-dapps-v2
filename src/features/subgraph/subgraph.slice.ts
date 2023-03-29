import { createSlice } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchCurrentInfoAsync,
	fetchXDaiInfoAsync,
	fetchMainnetInfoAsync,
} from './subgraph.thunks';
import type { ISubgraphState } from './subgraph.types';

const defaultGIVpowerInfo = {
	id: '',
	initialDate: '0',
	locksCreated: 0,
	roundDuration: 1,
	totalGIVLocked: '0',
	currentRound: 0,
	nextRoundDate: '0',
};

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
	xDaiValues: ISubgraphState;
} = {
	currentValues: defaultSubgraphValues,
	mainnetValues: defaultSubgraphValues,
	xDaiValues: defaultXdaiSubgraphValues,
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
				}
				if (action.payload.chainId === config.XDAI_NETWORK_NUMBER) {
					state.xDaiValues = action.payload.response;
				}
			})
			.addCase(fetchXDaiInfoAsync.fulfilled, (state, action) => {
				state.xDaiValues = action.payload;
			})
			.addCase(fetchMainnetInfoAsync.fulfilled, (state, action) => {
				state.mainnetValues = action.payload;
			});
	},
});

// Action creators are generated for each case reducer function
// export const {} = subgraphSlice.actions;

export default subgraphSlice.reducer;
