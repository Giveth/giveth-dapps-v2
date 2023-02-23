import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { getRequest, gqlRequest } from '@/helpers/requests';
import {
	FETCH_MAINNET_TOKEN_PRICE,
	FETCH_GNOSIS_TOKEN_PRICE,
} from './price.queries';

export const fetchEthPrice = async (): Promise<number> => {
	const res = await getRequest(
		'https://api.coingecko.com/api/v3/simple/price',
		undefined,
		{
			ids: 'ethereum',
			vs_currencies: 'usd',
		},
	);
	return res?.ethereum?.usd;
};

export const fetchMainnetTokenPrice = async (
	tokenId: string,
): Promise<string> => {
	const query = FETCH_MAINNET_TOKEN_PRICE;
	const variables = {
		tokenId: tokenId.toLowerCase(),
		daiId: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
	};
	const { data } = await gqlRequest(
		config.MAINNET_CONFIG.uniswapV2Subgraph,
		false,
		query,
		variables,
	);
	const tokenEthPrice = new BigNumber(data.token.derivedETH);
	const daiEthPrice = new BigNumber(data.daitoken.derivedETH);
	return tokenEthPrice.div(daiEthPrice).toString();
};

export const fetchGnosisTokenPrice = async (
	tokenId: string,
): Promise<string> => {
	const query = FETCH_GNOSIS_TOKEN_PRICE;
	const variables = {
		id: tokenId.toLowerCase(),
	};
	const { data } = await gqlRequest(
		config.XDAI_CONFIG.uniswapV2Subgraph,
		false,
		query,
		variables,
	);
	return data?.token?.derivedETH || '0';
};
