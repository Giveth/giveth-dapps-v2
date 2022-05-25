import { createAsyncThunk } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { RootState } from '../store';
import { Zero } from '@/helpers/number';
import { captureException } from '@sentry/nextjs';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import { IGetTokenPrice } from './price.types';

const fetchUniswapSubgraphTokenPrice = async (
	subgraphUrl: string | undefined,
	tokenAddress: string,
): Promise<BigNumber> => {
	if (!subgraphUrl || !tokenAddress) return Zero;

	try {
		const data = await fetchSubgraph(
			`
			{
				token(id:"${tokenAddress.toLowerCase()}") {
					derivedETH
				}
			}
		`,
			0,
			subgraphUrl,
		);
		return new BigNumber(data?.token?.derivedETH || 0);
	} catch (e) {
		console.log({ e });
		console.error('Error fetching token price:', tokenAddress, e);
		captureException(e, {
			tags: {
				section: 'fetUniswapSubgraphTokenPrice',
			},
		});
		return Zero;
	}
};

export const getTokenPrice = createAsyncThunk(
	'price/getTokenPrice',
	async ({ tokenAddress, network }: IGetTokenPrice, { getState }) => {
		const state = getState() as RootState;
		const { mainnetThirdPartyTokensPrice, xDaiThirdPartyTokensPrice } =
			state.price;
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				return mainnetThirdPartyTokensPrice
					? mainnetThirdPartyTokensPrice[tokenAddress.toLowerCase()]
					: Zero;
			case config.XDAI_NETWORK_NUMBER:
				return xDaiThirdPartyTokensPrice
					? xDaiThirdPartyTokensPrice[tokenAddress.toLowerCase()]
					: Zero;
		}
		return Zero;
	},
);

export const getEthPrice = createAsyncThunk('price/getEthPrice', async () => {
	return fetch(
		'https://feathers.giveth.io/conversionRates?from=ETH&to=USD&interval=hourly',
	)
		.then(async res => {
			const data = await res.json();
			return data.rate.toString();
		})
		.catch(error => {
			console.error(
				'Error on getting eth price from crypto-compare:',
				error,
			);
			captureException(error, {
				tags: {
					section: 'fetEthPrice',
				},
			});
		});
});

export const getGivXDaiPrice = createAsyncThunk(
	'price/getGivXDaiPrice',
	async ({ xDaiValues, ethPrice }: any) => {
		const { uniswapV2EthGivPair } = xDaiValues;
		if (uniswapV2EthGivPair) {
			const { token0, token1, reserve0, reserve1 } = uniswapV2EthGivPair;
			const { TOKEN_ADDRESS } = config.XDAI_CONFIG;

			switch (TOKEN_ADDRESS.toLowerCase()) {
				case token0.toLowerCase():
					return new BigNumber(ethPrice)
						.times(reserve1.toString())
						.div(reserve0.toString())
						.toString();
				case token1.toLowerCase():
					return new BigNumber(ethPrice)
						.times(reserve0.toString())
						.div(reserve1.toString())
						.toString();
				default:
					console.error(
						'Non of UniswapV2Pair tokens is GIV, ',
						uniswapV2EthGivPair,
					);
			}
		}
	},
);

export const getGivMainnetPrice = createAsyncThunk(
	'price/getGivMainnetPrice',
	async ({ pool, ethPrice }: any) => {
		const { token1, token0, token0Price, token1Price } = pool;
		switch (config.MAINNET_CONFIG.TOKEN_ADDRESS.toLowerCase()) {
			case token0.address.toLowerCase():
				return new BigNumber(ethPrice)
					.times(token0Price.toFixed(18))
					.toString();

			case token1.address.toLowerCase():
				return new BigNumber(ethPrice)
					.times(token1Price.toFixed(18))
					.toString();
			default:
				console.error('Non of UniswapV3Pool tokens is GIV');
		}
	},
);

export const getThirdPartiesMainnetTokenPrices = createAsyncThunk(
	'price/getThirdPartiesTokenPrices',
	async ({}, { getState }) => {
		const state = getState() as RootState;
		const { MAINNET_CONFIG } = config;
		let prices = { ...state.price.mainnetThirdPartyTokensPrice };
		if (MAINNET_CONFIG.uniswapV2Subgraph) {
			await Promise.all(
				MAINNET_CONFIG.regenStreams.map(async streamConfig => {
					const price = await fetchUniswapSubgraphTokenPrice(
						MAINNET_CONFIG.uniswapV2Subgraph,
						streamConfig.tokenAddressOnUniswapV2,
					);
					prices = {
						...prices,
						[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
							price.toString(),
					};
				}),
			);
			return prices;
		}
	},
);

export const getThirdPartiesXDaiTokenPrices = createAsyncThunk(
	'price/getThirdPartiesXDaiTokenPrices',
	async ({}, { getState }) => {
		const state = getState() as RootState;
		const { XDAI_CONFIG } = config;
		let prices = { ...state.price.xDaiThirdPartyTokensPrice };
		if (XDAI_CONFIG.uniswapV2Subgraph) {
			await Promise.all(
				XDAI_CONFIG.regenStreams.map(async streamConfig => {
					const price = await fetchUniswapSubgraphTokenPrice(
						XDAI_CONFIG.uniswapV2Subgraph,
						streamConfig.tokenAddressOnUniswapV2,
					);
					prices = {
						...prices,
						[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
							price.toString(),
					};
				}),
			);
			return prices;
		}
	},
);
