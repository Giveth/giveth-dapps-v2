import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import type { IPriceState } from './price.types';

const initialState: IPriceState = {
	givPrice: '0',
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
			action: PayloadAction<{ [tokenAddress: string]: BigNumber }>,
		) => {
			state.mainnetThirdPartyTokensPrice = action.payload;
		},
		setXDaiThirdPartTokensPrice: (
			state,
			action: PayloadAction<{ [tokenAddress: string]: BigNumber }>,
		) => {
			state.xDaiThirdPartyTokensPrice = action.payload;
		},
	},
});

export const {
	setGivPrice,
	setEthPrice,
	setMainnetThirdPartTokensPrice,
	setXDaiThirdPartTokensPrice,
} = priceSlice.actions;

export default priceSlice.reducer;
