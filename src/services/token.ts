import { captureException } from '@sentry/nextjs';
import { type Address } from 'viem';
import { getPublicClient } from 'wagmi/actions';
import { erc20Abi } from 'viem';
import { readContract } from '@wagmi/core';
import config from '@/configuration';
import { AddressZero } from '@/lib/constants/constants';
import { ChainType } from '@/types/config';
import { wagmiConfig } from '@/wagmiconfig';

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
		console.log('error on fetchBalance', { error });
		return;
	}
};

export const fetchETCPrice = async () => {
	try {
		const res = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=ethereum-classic&vs_currencies=usd',
		);
		const data = await res.json();
		return parseFloat(data['ethereum-classic'].usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};

export const fetchSolanaPrice = async () => {
	try {
		const res = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
		);
		const data = await res.json();
		return parseFloat(data.solana.usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};
