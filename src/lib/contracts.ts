import { captureException } from '@sentry/nextjs';
import { readContracts } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';
import config from '@/configuration';
import { MAX_TOKEN_ORDER } from './constants/tokens';
import { wagmiConfig } from '@/wagmiconfig';

const mainnetConfig = config.MAINNET_CONFIG;
export const uniswapV3Config = mainnetConfig.v3Pools[0];

const { NFT_POSITIONS_MANAGER_ADDRESS, UNISWAP_V3_STAKER, UNISWAP_V3_LP_POOL } =
	uniswapV3Config || {};

interface IERC20Info {
	contractAddress: Address;
	networkId: number;
}

export async function getERC20Info({ contractAddress, networkId }: IERC20Info) {
	try {
		const baseProps = {
			address: contractAddress!,
			abi: erc20Abi,
		} as const;
		const result = await readContracts(wagmiConfig, {
			contracts: [
				{
					...baseProps,
					functionName: 'name',
				},
				{
					...baseProps,
					functionName: 'symbol',
				},
				{
					...baseProps,
					functionName: 'decimals',
				},
			],
		});
		const name = getReadContractResult(result[0]);
		const symbol = getReadContractResult(result[1]);
		const decimals = getReadContractResult(result[2]);
		const ERC20Info = {
			name,
			symbol,
			address: contractAddress,
			networkId,
			decimals,
			order: MAX_TOKEN_ORDER,
		};
		console.log({ ERC20Info });

		return ERC20Info;
	} catch (error) {
		console.log({ error });
		captureException(error, {
			tags: {
				section: 'getERC20Info',
			},
		});
		return false;
	}
}

export function getReadContractResult(result: any) {
	return result.status === 'success' ? result.result : undefined;
}
