import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGetTokenPrice } from './price.types';
import { RootState } from '../store';
import { Zero } from '@/helpers/number';
import config from '@/configuration';

export const getTokenPrice = createAsyncThunk(
	'price/getTokenPrice',
	async ({ tokenAddress, network }: IGetTokenPrice, { getState }) => {
		const state = getState() as RootState;
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				return (
					state.price.mainnetThirdPartyTokensPrice[
						tokenAddress.toLowerCase()
					] || Zero
				);
			case config.XDAI_NETWORK_NUMBER:
				return (
					state.price.xDaiThirdPartyTokensPrice[
						tokenAddress.toLowerCase()
					] || Zero
				);
		}
		return Zero;
	},
);
