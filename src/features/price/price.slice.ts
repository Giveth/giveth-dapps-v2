import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	getEthPrice,
	getGivXDaiPrice,
	getGivMainnetPrice,
	getThirdPartiesMainnetTokenPrices,
	getThirdPartiesXDaiTokenPrices,
} from './price.thunks';
import type { IPriceState } from './price.types';

const initialState: IPriceState = {
	givPrice: '0',
	mainnetPrice: '0',
	xDaiPrice: '0',
	ethPrice: '0',
	mainnetThirdPartyTokensPrice: {},
	xDaiThirdPartyTokensPrice: {},
};

export const priceSlice = createSlice({
	name: 'price',
	initialState,
	reducers: {
		setGivPrice: (state, action: PayloadAction<string>) => {
			state.givPrice = action.payload;
		},
		setEthPrice: (state, action: PayloadAction<string>) => {
			state.ethPrice = action.payload;
		},
		setMainnetThirdPartTokensPrice: (
			state,
			action: PayloadAction<{ [tokenAddress: string]: string }>,
		) => {
			state.mainnetThirdPartyTokensPrice = action.payload;
		},
		setXDaiThirdPartTokensPrice: (
			state,
			action: PayloadAction<{ [tokenAddress: string]: string }>,
		) => {
			state.xDaiThirdPartyTokensPrice = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getEthPrice.fulfilled, (state, action) => {
				state.ethPrice = action.payload;
			})
			.addCase(getGivMainnetPrice.fulfilled, (state, action) => {
				state.mainnetPrice = action.payload;
			})
			.addCase(getGivXDaiPrice.fulfilled, (state, action) => {
				state.xDaiPrice = action.payload;
			})
			.addCase(
				getThirdPartiesMainnetTokenPrices.fulfilled,
				(state, action) => {
					console.log('MAIN', action.payload);
					state.mainnetThirdPartyTokensPrice = action.payload;
				},
			)
			.addCase(
				getThirdPartiesXDaiTokenPrices.fulfilled,
				(state, action) => {
					console.log('XDAI', action.payload);
					state.xDaiThirdPartyTokensPrice = action.payload;
				},
			);
	},
});

export const {
	setGivPrice,
	setEthPrice,
	setMainnetThirdPartTokensPrice,
	setXDaiThirdPartTokensPrice,
} = priceSlice.actions;

export default priceSlice.reducer;
