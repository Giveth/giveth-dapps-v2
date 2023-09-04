import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchGnosisTokenPrice,
	fetchMainnetTokenPrice,
} from './price.services';

export const fetchGIVPriceAsync = createAsyncThunk(
	'price/fetchGIVPrice',
	async (chainId: number) => {
		const tokenAddress =
			config.NETWORKS_CONFIG[chainId]?.tokenAddressOnUniswapV2;
		return tokenAddress ? await fetchGnosisTokenPrice(tokenAddress) : '0';
	},
);

export const fetchMainnetThirdPartyTokensPriceAsync = createAsyncThunk(
	'price/fetchMainnetThirdPartyTokensPrice',
	async () => {
		const promises: Promise<string>[] = [];
		config.MAINNET_CONFIG.regenStreams.forEach(streamConfig => {
			const tokenAddress =
				streamConfig.tokenAddressOnUniswapV2.toLowerCase();
			promises.push(fetchMainnetTokenPrice(tokenAddress));
		});
		return Promise.all(promises).then(prices => {
			let res: { [x: string]: string } = {};
			config.MAINNET_CONFIG.regenStreams.forEach((streamConfig, idx) => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				res[tokenAddress] = prices[idx];
			});
			return res;
		});
	},
);

export const fetchGnosisThirdPartyTokensPriceAsync = createAsyncThunk(
	'price/fetchGnosisThirdPartyTokensPric',
	async () => {
		const promises: Promise<string>[] = [];
		config.GNOSIS_CONFIG.regenStreams.forEach(streamConfig => {
			const tokenAddress =
				streamConfig.tokenAddressOnUniswapV2.toLowerCase();
			promises.push(fetchGnosisTokenPrice(tokenAddress));
		});
		return Promise.all(promises).then(prices => {
			let res: { [x: string]: string } = {};
			config.GNOSIS_CONFIG.regenStreams.forEach((streamConfig, idx) => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				res[tokenAddress] = prices[idx];
			});
			return res;
		});
	},
);
