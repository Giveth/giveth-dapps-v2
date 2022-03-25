import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { Zero } from '@/helpers/number';
import { useSubgraph } from '@/context/subgraph.context';
import config from '@/configuration';
import { useLiquidityPositions } from '@/context/positions.context';
import { useWeb3React } from '@web3-react/core';

export interface IPriceContext {
	givPrice: BigNumber;
	getTokenPrice: (address: string, network: number) => BigNumber;
	ethPrice: BigNumber;
}

const priceDefaultValue: IPriceContext = {
	givPrice: Zero,
	getTokenPrice: () => Zero,
	ethPrice: Zero,
};

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
		return Zero;
	}
};

const PriceContext = createContext<IPriceContext>(priceDefaultValue);
export const PriceProvider: FC = ({ children }) => {
	const { chainId } = useWeb3React();
	const { xDaiValues } = useSubgraph();
	const { pool } = useLiquidityPositions();

	const [currentPrice, setCurrentPrice] = useState<BigNumber>(Zero);
	const [mainnetPrice, setMainnetPrice] = useState<BigNumber>(Zero);
	const [xDaiPrice, setXDaiPrice] = useState<BigNumber>(Zero);
	const [ethPrice, setEthPrice] = useState<BigNumber>(Zero);
	const [mainnetThirdPartyTokensPrice, setMainnetThirdPartTokensPrice] =
		useState<{ [tokenAddress: string]: BigNumber }>({});
	const [xDaiThirdPartyTokensPrice, setXDaiThirdPartTokensPrice] = useState<{
		[tokenAddress: string]: BigNumber;
	}>({});

	const getTokenPrice = useCallback(
		(tokenAddress: string, network: number): BigNumber => {
			switch (network) {
				case config.MAINNET_NETWORK_NUMBER:
					return (
						mainnetThirdPartyTokensPrice[
							tokenAddress.toLowerCase()
						] || Zero
					);

				case config.XDAI_NETWORK_NUMBER:
					return (
						xDaiThirdPartyTokensPrice[tokenAddress.toLowerCase()] ||
						Zero
					);
			}
			return Zero;
		},
		[mainnetThirdPartyTokensPrice, xDaiThirdPartyTokensPrice],
	);

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
				setEthPrice(new BigNumber(data.rate));
			})
			.catch(error => {
				console.error(
					'Error on getting eth price from crypto-compare:',
					error,
				);
			});

		const { MAINNET_CONFIG, XDAI_CONFIG } = config;
		if (MAINNET_CONFIG.uniswapV2Subgraph) {
			MAINNET_CONFIG.regenStreams.forEach(streamConfig => {
				fetchUniswapSubgraphTokenPrice(
					MAINNET_CONFIG.uniswapV2Subgraph,
					streamConfig.tokenAddressOnUniswapV2,
				).then(price =>
					setMainnetThirdPartTokensPrice({
						...mainnetThirdPartyTokensPrice,
						[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
							price,
					}),
				);
			});
		}
		if (XDAI_CONFIG.uniswapV2Subgraph) {
			XDAI_CONFIG.regenStreams.forEach(streamConfig => {
				fetchUniswapSubgraphTokenPrice(
					XDAI_CONFIG.uniswapV2Subgraph,
					streamConfig.tokenAddressOnUniswapV2,
				).then(price => {
					setXDaiThirdPartTokensPrice({
						...xDaiThirdPartyTokensPrice,
						[streamConfig.tokenAddressOnUniswapV2.toLowerCase()]:
							price,
					});
				});
			});
		}
	}, []);

	useEffect(() => {
		switch (chainId) {
			case config.XDAI_NETWORK_NUMBER:
				setCurrentPrice(xDaiPrice);
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				setCurrentPrice(mainnetPrice);
				break;
		}
	}, [chainId, xDaiPrice, mainnetPrice]);

	useEffect(() => {});
	return (
		<PriceContext.Provider
			value={{
				givPrice: currentPrice,
				getTokenPrice,
				ethPrice,
			}}
		>
			{children}
		</PriceContext.Provider>
	);
};

export function usePrice() {
	const context = useContext(PriceContext);

	if (!context) {
		throw new Error('Price balance context not found!');
	}

	return context;
}
