import { createSlice } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchAllInfoAsync,
	fetchChainInfoAsync,
	fetchCurrentInfoAsync,
} from './subgraph.thunks';
import {
	chainInfoNames,
	getDefaultSubgraphValues,
	isSubgraphKeyValid,
} from './subgraph.helper';
import type { ISubgraphState } from './subgraph.types';

const initialState: {
	currentValues: ISubgraphState;
	mainnetValues: ISubgraphState;
	gnosisValues: ISubgraphState;
	optimismValues: ISubgraphState;
} = {
	currentValues: getDefaultSubgraphValues(config.MAINNET_NETWORK_NUMBER), // Mainnet by default
	mainnetValues: getDefaultSubgraphValues(config.MAINNET_NETWORK_NUMBER),
	gnosisValues: getDefaultSubgraphValues(config.GNOSIS_NETWORK_NUMBER),
	optimismValues: getDefaultSubgraphValues(config.OPTIMISM_NETWORK_NUMBER),
};

export const subgraphSlice = createSlice({
	name: 'subgraph',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCurrentInfoAsync.fulfilled, (state, action) => {
				const { chainId, response } = action.payload;
				state.currentValues = response;
				const key = chainInfoNames[chainId];
				if (isSubgraphKeyValid(key)) state[key] = response;
			})
			.addCase(fetchAllInfoAsync.fulfilled, (state, action) => {
				const { chainId, response } = action.payload;
				for (const key in response) {
					if (
						Object.prototype.hasOwnProperty.call(state, key) &&
						isSubgraphKeyValid(key)
					) {
						const chainInfo = response[key];
						if (chainInfo) {
							state[key] = chainInfo;
							if (chainInfo.networkNumber === chainId)
								state.currentValues = chainInfo;
						}
					}
				}
			})
			.addCase(fetchChainInfoAsync.fulfilled, (state, action) => {
				const { chainId, response } = action.payload;
				const key = chainInfoNames[chainId];
				if (isSubgraphKeyValid(key)) state[key] = response;
			});
	},
});

export default subgraphSlice.reducer;
