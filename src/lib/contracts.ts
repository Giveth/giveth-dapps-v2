import { captureException } from '@sentry/nextjs';
import { getContract } from 'wagmi/actions';
import { erc20ABI } from 'wagmi';
import config from '@/configuration';
import { MAX_TOKEN_ORDER } from './constants/tokens';

const mainnetConfig = config.MAINNET_CONFIG;
export const uniswapV3Config = mainnetConfig.v3Pools[0];

const { NFT_POSITIONS_MANAGER_ADDRESS, UNISWAP_V3_STAKER, UNISWAP_V3_LP_POOL } =
	uniswapV3Config || {};

interface IERC20Info {
	contractAddress: `0x${string}`;
	networkId: number;
}

export async function getERC20Info({ contractAddress, networkId }: IERC20Info) {
	try {
		const contract = getContract({
			address: contractAddress!,
			abi: erc20ABI,
		});
		const name = await contract.read.name();
		const symbol = await contract.read.symbol();
		const decimals = await contract.read.decimals();
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
