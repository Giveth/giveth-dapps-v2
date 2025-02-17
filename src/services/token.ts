import { captureException } from '@sentry/nextjs';
import { type Address } from 'viem';
import { getPublicClient, multicall, getBalance } from 'wagmi/actions';
import { erc20Abi } from 'viem';
import { readContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { AddressZero } from '@/lib/constants/constants';
import { ChainType } from '@/types/config';
import { wagmiConfig } from '@/wagmiConfigs';
import {
	FETCH_GNOSIS_TOKEN_PRICES,
	FETCH_MAINNET_TOKEN_PRICES,
} from '@/apollo/gql/gqlPrice';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { IToken } from '@/types/superFluid';

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
		console.error('error on fetchBalance', {
			error,
			tokenAddress,
			userAddress,
		});
		return;
	}
};

export const fetchRecurringBalance = async (
	tokenAddress: Address,
	userAddress: Address,
	chainID: number,
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
				chainId: chainID,
			});
		}
	} catch (error) {
		console.error('error on fetchBalance', {
			error,
			tokenAddress,
			userAddress,
		});
		return;
	}
};

export const fetchEVMTokenBalances = async <
	T extends IProjectAcceptedToken | IToken,
>(
	tokens: T[], // Generic type constrained to IProjectAcceptedToken or IToken
	walletAddress: string | null,
): Promise<{ token: T; balance: bigint | undefined }[]> => {
	if (!walletAddress || !tokens || tokens.length === 0) return [];

	// Filter out native tokens
	const erc20Tokens: T[] = [];
	const nativeTokens: T[] = [];

	// Use the correct property name based on the generic token type
	const addressLabel = 'address' in tokens[0] ? 'address' : 'id';

	tokens.forEach(token => {
		const tokenAddress = token[addressLabel as keyof T] as string;

		if (tokenAddress !== AddressZero) {
			erc20Tokens.push(token);
		} else {
			nativeTokens.push(token);
		}
	});

	const erc20Calls = erc20Tokens.map(token => {
		const tokenAddress = token[addressLabel as keyof T] as string;

		// Ensure the tokenAddress is cast as Address (format starting with 0x)
		return {
			address: tokenAddress as Address, // Cast to wagmi Address type
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [walletAddress],
		};
	});

	try {
		// Fetch balances for ERC20 tokens via multicall
		const erc20Results = await multicall(wagmiConfig, {
			contracts: erc20Calls,
			allowFailure: true,
		});

		// Fetch balances for native tokens (e.g., ETH)
		const nativeTokenBalances = await Promise.all(
			nativeTokens.map(async nativeToken => {
				const balance = await getBalance(wagmiConfig, {
					address: walletAddress as Address,
				});
				return {
					token: nativeToken,
					balance: balance.value || 0n,
				};
			}),
		);

		// Map ERC20 results to balances
		const erc20Balances = erc20Results.map((result, index) => ({
			token: erc20Tokens[index],
			balance: (result?.result as bigint) || 0n,
		}));

		// Combine ERC20 and native token balances
		return [...erc20Balances, ...nativeTokenBalances];
	} catch (error) {
		console.error('Error fetching EVM token balances:', error);

		// Return undefined balances in case of failure
		return tokens.map(token => ({ token, balance: undefined }));
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

export const fetchMainnetTokenPrices = async (
	tokenIds: string[],
): Promise<{ [key: string]: string }> => {
	const query = FETCH_MAINNET_TOKEN_PRICES;
	const variables = {
		tokenIds: tokenIds.map(id => id.toLowerCase()),
		daiId: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
	};
	const body = {
		query,
		variables,
	};
	const myHeaders = new Headers();
	myHeaders.append('content-type', 'application/json');

	if (!config.MAINNET_CONFIG.uniswapV2Subgraph) return {};

	const res = await fetch(config.MAINNET_CONFIG.uniswapV2Subgraph, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: myHeaders,
	});

	const data = await res.json();
	const daiEthPrice = new BigNumber(data?.data?.daitoken?.derivedETH);

	const prices: { [key: string]: string } = {};
	data?.data?.tokens.forEach((token: any) => {
		const tokenEthPrice = new BigNumber(token.derivedETH);
		prices[token.id.toLowerCase()] = tokenEthPrice
			.div(daiEthPrice)
			.toString();
	});

	return prices;
};

export const fetchGnosisTokenPrices = async (
	tokenIds: string[],
): Promise<{ [key: string]: string }> => {
	const query = FETCH_GNOSIS_TOKEN_PRICES;
	const variables = {
		ids: tokenIds.map(id => id.toLowerCase()),
	};
	const body = {
		query,
		variables,
	};

	const myHeaders = new Headers();
	myHeaders.append('content-type', 'application/json');

	const res = await fetch(config.GNOSIS_CONFIG.uniswapV2Subgraph!, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: myHeaders,
	});

	const data = await res.json();
	const prices: { [key: string]: string } = {};

	data?.data?.tokens.forEach((token: any) => {
		prices[token.id.toLowerCase()] = token.derivedNativeCurrency || '0';
	});

	return prices;
};
