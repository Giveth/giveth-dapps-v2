import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import UniswapV3PoolJson from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import { captureException } from '@sentry/nextjs';
import { getContract } from 'wagmi/actions';
import { erc20ABI } from 'wagmi';
import UNISWAP_V3_STAKER_ABI from '@/artifacts/uniswap_v3_staker.json';
import config from '@/configuration';
import { INonfungiblePositionManager, IUniswapV3Pool } from '@/types/contracts';
import { MAX_TOKEN_ORDER } from './constants/tokens';

const { abi: UniswapV3PoolABI } = UniswapV3PoolJson;
const { abi: NonfungiblePositionManagerABI } = NonfungiblePositionManagerJson;

const mainnetConfig = config.MAINNET_CONFIG;
export const uniswapV3Config = mainnetConfig.v3Pools[0];

const { NFT_POSITIONS_MANAGER_ADDRESS, UNISWAP_V3_STAKER, UNISWAP_V3_LP_POOL } =
	uniswapV3Config || {};

export const getNftManagerPositionsContract = (
	provider: Web3Provider | null,
): INonfungiblePositionManager | undefined => {
	const signer = provider?.getSigner();

	if (!signer) {
		return;
	}

	return new Contract(
		NFT_POSITIONS_MANAGER_ADDRESS,
		NonfungiblePositionManagerABI,
		signer,
	) as INonfungiblePositionManager;
};


export const getGivethV3PoolContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		return;
	}

	return new Contract(
		UNISWAP_V3_LP_POOL,
		UniswapV3PoolABI,
		signer,
	) as IUniswapV3Pool;
};

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
