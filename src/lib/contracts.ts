import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import UniswapV3PoolJson from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import { captureException } from '@sentry/nextjs';
import UNISWAP_V3_STAKER_ABI from '@/artifacts/uniswap_v3_staker.json';
import { StakingType, UniswapV3PoolStakingConfig } from '@/types/config';
import config from '@/configuration';

const { abi: UniswapV3PoolABI } = UniswapV3PoolJson;
const { abi: NonfungiblePositionManagerABI } = NonfungiblePositionManagerJson;

const mainnetConfig = config.MAINNET_CONFIG;
const uniswapV3Config = mainnetConfig.pools.find(
	c => c.type === StakingType.UNISWAPV3_ETH_GIV,
) as UniswapV3PoolStakingConfig;

const { NFT_POSITIONS_MANAGER_ADDRESS, UNISWAP_V3_STAKER, UNISWAP_V3_LP_POOL } =
	uniswapV3Config;

export const getNftManagerPositionsContract = (
	provider: Web3Provider | null,
) => {
	const signer = provider?.getSigner();

	if (!signer) {
		return;
	}

	return new Contract(
		NFT_POSITIONS_MANAGER_ADDRESS,
		NonfungiblePositionManagerABI,
		signer,
	);
};

export const getUniswapV3StakerContract = (
	provider: Web3Provider | null,
	isUnchecked?: boolean,
) => {
	let signer;

	if (isUnchecked) {
		signer = provider?.getSigner().connectUnchecked();
	} else {
		signer = provider?.getSigner();
	}
	if (!signer) {
		return;
	}

	return new Contract(UNISWAP_V3_STAKER, UNISWAP_V3_STAKER_ABI, signer);
};

export const getGivethV3PoolContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		return;
	}

	return new Contract(UNISWAP_V3_LP_POOL, UniswapV3PoolABI, signer);
};

interface IERC20Info {
	library: Web3Provider;
	tokenAbi: string;
	contractAddress: string;
	networkId: number;
}

export async function getERC20Info({
	library,
	tokenAbi,
	contractAddress,
	networkId,
}: IERC20Info) {
	try {
		const instance = new Contract(contractAddress, tokenAbi, library);
		const name = await instance.name();
		const symbol = await instance.symbol();
		const decimals = await instance.decimals();
		const ERC20Info = {
			name,
			symbol,
			address: contractAddress,
			networkId,
			decimals,
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
