import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Zero } from '@/helpers/number';
import { useAppSelector, useAppDispatch } from '@/features/hooks';
import { useLiquidityPositions } from '@/hooks/useLiquidityPositions';
import { captureException } from '@sentry/nextjs';
import {
	setGivPrice,
	setEthPrice,
	setMainnetThirdPartTokensPrice,
	setXDaiThirdPartTokensPrice,
} from '@/features/price/price.slice';
import BigNumber from 'bignumber.js';
import config from '@/configuration';

const fetchUniswapSubgraphTokenPrice = async (
	subgraphUrl: string | undefined,
	tokenAddress: string,
): Promise<BigNumber> => {
	if (!subgraphUrl || !tokenAddress) return Zero;

	try {
		const query = `
		{
			token(id:"${tokenAddress.toLowerCase()}") {
				derivedETH
			}
		}
		`;
		const body = { query };
		const res = await fetch(subgraphUrl, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const { data } = await res.json();
		return new BigNumber(data?.token?.derivedETH || 0);
	} catch (e) {
		console.error('Error fetching token price:', tokenAddress, e);
		captureException(e, {
			tags: {
				section: 'fetUniswapSubgraphTokenPrice',
			},
		});
		return Zero;
	}
};

const PriceController = () => {
	const dispatch = useAppDispatch();
	const { chainId } = useWeb3React();
	const { pool } = useLiquidityPositions();
	const [xDaiPrice, setXDaiPrice] = useState<BigNumber>(Zero);
	const [mainnetPrice, setMainnetPrice] = useState<BigNumber>(Zero);
	const xDaiValues = useAppSelector(state => state.subgraph.xDaiValues);

	const {
		ethPrice,
		mainnetThirdPartyTokensPrice,
		xDaiThirdPartyTokensPrice,
	} = useAppSelector(state => state.price);

	useEffect(() => {
		const { uniswapV2EthGivPair } = xDaiValues;
		if (uniswapV2EthGivPair) {
			const { token0, token1, reserve0, reserve1 } = uniswapV2EthGivPair;
			const { TOKEN_ADDRESS } = config.XDAI_CONFIG;

			switch (TOKEN_ADDRESS.toLowerCase()) {
				case token0.toLowerCase():
					setXDaiPrice(
						ethPrice
							.times(reserve1.toString())
							.div(reserve0.toString()),
					);
					break;
				case token1.toLowerCase():
					setXDaiPrice(
						ethPrice
							.times(reserve0.toString())
							.div(reserve1.toString()),
					);
					break;
				default:
					console.error(
						'Non of UniswapV2Pair tokens is GIV, ',
						uniswapV2EthGivPair,
					);
			}
		}
	}, [xDaiValues, ethPrice]);

	useEffect(() => {
		if (pool) {
			const { token1, token0, token0Price, token1Price } = pool;
			switch (config.MAINNET_CONFIG.TOKEN_ADDRESS.toLowerCase()) {
				case token0.address.toLowerCase():
					setMainnetPrice(ethPrice.times(token0Price.toFixed(18)));
					break;

				case token1.address.toLowerCase():
					setMainnetPrice(ethPrice.times(token1Price.toFixed(18)));
					break;

				default:
					console.error('Non of UniswapV3Pool tokens is GIV');
			}
		}
	}, [pool, ethPrice]);

	useEffect(() => {
		// fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
		fetch(
			'https://feathers.giveth.io/conversionRates?from=ETH&to=USD&interval=hourly',
		)
			.then(async res => {
				const data = await res.json();
				dispatch(setEthPrice(new BigNumber(data.rate)));
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

		const { MAINNET_CONFIG, XDAI_CONFIG } = config;
		if (MAINNET_CONFIG.uniswapV2Subgraph) {
			MAINNET_CONFIG.regenStreams.forEach(streamConfig => {
				fetchUniswapSubgraphTokenPrice(
					MAINNET_CONFIG.uniswapV2Subgraph,
					streamConfig.tokenAddressOnUniswapV2,
				).then(price =>
					dispatch(
						setMainnetThirdPartTokensPrice({
							...mainnetThirdPartyTokensPrice,
							[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
								price,
						}),
					),
				);
			});
		}
		if (XDAI_CONFIG.uniswapV2Subgraph) {
			XDAI_CONFIG.regenStreams.forEach(streamConfig => {
				fetchUniswapSubgraphTokenPrice(
					XDAI_CONFIG.uniswapV2Subgraph,
					streamConfig.tokenAddressOnUniswapV2,
				).then(price => {
					dispatch(
						setXDaiThirdPartTokensPrice({
							...xDaiThirdPartyTokensPrice,
							[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
								price,
						}),
					);
				});
			});
		}
	}, []);

	useEffect(() => {
		switch (chainId) {
			case config.XDAI_NETWORK_NUMBER:
				dispatch(setGivPrice(xDaiPrice));
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				dispatch(setGivPrice(mainnetPrice));
				break;
		}
	}, [chainId, xDaiPrice, mainnetPrice]);

	return null;
};

export default PriceController;
