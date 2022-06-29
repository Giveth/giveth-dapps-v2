import { createSlice } from '@reduxjs/toolkit';
import { ZeroBalances } from '@/types/subgraph';
import config from '@/configuration';
import {
	fetchCurrentInfoAsync,
	fetchXDaiInfoAsync,
	fetchMainnetInfoAsync,
} from './subgraph.thunks';
import type { ISubgraphState } from './subgraph.types';

const defaultGIVPowerPositions = {
	givPowers: {
		id: '',
		currentRound: 0,
		initialDate: 0,
		locksCreated: 0,
		nextRoundDate: 0,
		roundDuration: 1,
		totalGIVLocked: 0,
	},
	tokenLocks: [],
};

export const defaultSubgraphValues: ISubgraphState = {
	balances: ZeroBalances,
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	GIVPowerPositions: defaultGIVPowerPositions,
};

const initialState: {
	currentValues: ISubgraphState;
	mainnetValues: ISubgraphState;
	xDaiValues: ISubgraphState;
	isLoaded: boolean;
} = {
	currentValues: defaultSubgraphValues,
	mainnetValues: defaultSubgraphValues,
	xDaiValues: defaultSubgraphValues,
	isLoaded: false,
};

export const subgraphSlice = createSlice({
	name: 'subgraph',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCurrentInfoAsync.fulfilled, (state, action) => {
				state.isLoaded = true;
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
