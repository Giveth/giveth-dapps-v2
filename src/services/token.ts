import { captureException } from '@sentry/nextjs';
import { type Address } from 'viem';
import { getPublicClient } from 'wagmi/actions';
import { erc20Abi } from 'viem';
import { readContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { AddressZero } from '@/lib/constants/constants';
import { ChainType } from '@/types/config';
import { wagmiConfig } from '@/wagmiConfigs';
import {
	FETCH_GNOSIS_TOKEN_PRICE,
	FETCH_MAINNET_TOKEN_PRICE,
} from '@/apollo/gql/gqlPrice';

export const fetchPrice = async (
	chainId: number | ChainType,
	tokenAddress?: string,
) => {
	try {
		const chain = config.NETWORKS_CONFIG[chainId || 1].coingeckoChainName;
		const fetchCall = await fetch(
			`https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
		);
		const data = await fetchCall.json();
		return parseFloat(data[Object.keys(data)[0]]?.usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};

export const fetchBalance = async (
	tokenAddress: Address,
	userAddress: Address,
) => {
	try {
		if (tokenAddress === AddressZero) {
			const client = getPublicClient(wagmiConfig);
			return client?.getBalance({ address: userAddress });
		} else {
			return await readContract(wagmiConfig, {
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [userAddress],
			});
		}
	} catch (error) {
		console.error('error on fetchBalance', { error });
		return;
	}
};

export const fetchPriceWithCoingeckoId = async (coingeckoId: string) => {
	try {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
		);
		const data = await res.json();
		return parseFloat(data[coingeckoId].usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};

export const fetchMainnetTokenPrice = async (
	tokenId: string,
): Promise<string> => {
	const query = FETCH_MAINNET_TOKEN_PRICE;
	const variables = {
		tokenId: tokenId.toLowerCase(),
		daiId: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
	};
	const body = {
		query,
		variables,
	};
	const myHeaders = new Headers();
	myHeaders.append('content-type', 'application/json');
	const res = await fetch(config.MAINNET_CONFIG.uniswapV2Subgraph, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: myHeaders,
	});
	const data = await res.json();
	const tokenEthPrice = new BigNumber(data?.data?.token.derivedETH);
	const daiEthPrice = new BigNumber(data?.data?.daitoken.derivedETH);
	return tokenEthPrice.div(daiEthPrice).toString();
};

export const fetchGnosisTokenPrice = async (
	tokenId?: string,
): Promise<string> => {
	if (!tokenId) return '0';
	const query = FETCH_GNOSIS_TOKEN_PRICE;
	const variables = {
		id: tokenId.toLowerCase(),
	};
	const subgraph = config.GNOSIS_CONFIG.uniswapV2Subgraph;
	if (!subgraph) {
		console.log('Subgraph is not defined');
		return '0';
	}
	const body = {
		query,
		variables,
	};

	const myHeaders = new Headers();
	myHeaders.append('content-type', 'application/json');

	const requestOptions: RequestInit = {
		method: 'POST',
		body: JSON.stringify(body),
		headers: myHeaders,
	};
	const res = await fetch(
		config.GNOSIS_CONFIG.uniswapV2Subgraph!,
		requestOptions,
	);
	const data = await res.json();
	return data?.data?.token?.derivedNativeCurrency || '0';
};
