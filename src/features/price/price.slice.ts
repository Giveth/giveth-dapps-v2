import { createSlice } from '@reduxjs/toolkit';
import {
	fetchGIVPriceAsync,
	fetchGnosisThirdPartyTokensPriceAsync,
	fetchMainnetThirdPartyTokensPriceAsync,
} from './price.thunks';

const initialState: {
	ethPrice: string;
	givPrice: string;
	mainnetThirdPartyTokensPrice: {
		[tokenAddress: string]: string;
	};
	xDaiThirdPartyTokensPrice: {
		[tokenAddress: string]: string;
	};
} = {
	ethPrice: '0',
	givPrice: '0',
	mainnetThirdPartyTokensPrice: {},
	xDaiThirdPartyTokensPrice: {},
};

export const priceSlice = createSlice({
	name: 'price',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchGIVPriceAsync.fulfilled, (state, action) => {
				state.givPrice = action.payload;
			})
			.addCase(
				fetchMainnetThirdPartyTokensPriceAsync.fulfilled,
				(state, action) => {
					state.mainnetThirdPartyTokensPrice = action.payload;
				},
			)
			.addCase(
				fetchGnosisThirdPartyTokensPriceAsync.fulfilled,
				(state, action) => {
					state.xDaiThirdPartyTokensPrice = action.payload;
				},
			);
	},
});

export default priceSlice.reducer;
