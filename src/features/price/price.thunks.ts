import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchEthPrice,
	fetchGnosisTokenPrice,
	fetchMainnetTokenPrice,
} from './price.services';

export const fetchEthPriceAsync = createAsyncThunk(
	'subgraph/fetchEthPrice',
	async () => {
		const rate = await fetchEthPrice();
		return rate;
	},
);

export const fetchGIVPriceAsync = createAsyncThunk(
	'subgraph/fetchGIVPrice',
	async (chainId: number) => {
		if (chainId === config.MAINNET_NETWORK_NUMBER) {
			return await fetchMainnetTokenPrice(
				config.MAINNET_CONFIG.TOKEN_ADDRESS,
			);
		}
		return await fetchGnosisTokenPrice(config.XDAI_CONFIG.TOKEN_ADDRESS);
	},
);

export const fetchMainnetThirdPartyTokensPriceAsync = createAsyncThunk(
	'subgraph/fetchMainnetThirdPartyTokensPrice',
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
	'subgraph/fetchGnosisThirdPartyTokensPric',
	async () => {
		const promises: Promise<string>[] = [];
		config.XDAI_CONFIG.regenStreams.forEach(streamConfig => {
			const tokenAddress =
				streamConfig.tokenAddressOnUniswapV2.toLowerCase();
			promises.push(fetchGnosisTokenPrice(tokenAddress));
		});
		return Promise.all(promises).then(prices => {
			let res: { [x: string]: string } = {};
			config.XDAI_CONFIG.regenStreams.forEach((streamConfig, idx) => {
				const tokenAddress =
					streamConfig.tokenAddressOnUniswapV2.toLowerCase();
				res[tokenAddress] = prices[idx];
			});
			return res;
		});
	},
);
