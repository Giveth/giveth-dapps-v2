import { createContext, FC, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Zero } from '@/helpers/number';
import { useSubgraph } from '@/context/subgraph.context';
import config from '@/configuration';
import { useLiquidityPositions } from '@/context/positions.context';
import { useWeb3React } from '@web3-react/core';

export interface IPriceContext {
	price: BigNumber;
}

const priceDefaultValue = {
	price: Zero,
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
				price: currentPrice,
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
