import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Zero } from '@/helpers/number';
import type { IPriceState, IPriceValues } from './price.types';
import BigNumber from 'bignumber.js';

export const priceValues: IPriceValues = {
	givPrice: Zero,
	ethPrice: Zero,
};

const initialState: IPriceState = {
	priceValues,
	mainnetThirdPartyTokensPrice: {},
	xDaiThirdPartyTokensPrice: {},
};

export const priceSlice = createSlice({
	name: 'price',
	initialState,
	reducers: {
		setGivPrice: (state, action: PayloadAction<BigNumber>) => {
			state.priceValues.givPrice = action.payload;
		},
		setEthPrice: (state, action: PayloadAction<BigNumber>) => {
			state.priceValues.ethPrice = action.payload;
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
