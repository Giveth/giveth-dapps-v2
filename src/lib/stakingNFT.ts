import { Dispatch, SetStateAction } from 'react';
import { captureException } from '@sentry/nextjs';
import { WriteContractReturnType } from 'viem';
import { readContract } from '@wagmi/core';
import { writeContract } from '@wagmi/core';
import { LiquidityPosition } from '@/types/nfts';
import { uniswapV3Config } from './contracts';
import { StakeState } from '@/lib/staking';
import UNISWAP_V3_STAKER_ABI from '@/artifacts/uniswap_v3_staker.json';
import { wagmiConfig } from '@/wagmiconfig';

export const transfer = async (
	tokenId: number | undefined,
	walletAddress: string,
	chainId: number,
	currentIncentive: { key?: (string | number)[] | null },
	handleStakeStatus: Dispatch<SetStateAction<StakeState>>,
): Promise<WriteContractReturnType | undefined> => {
	// TODO: Handle this
	// try {
	// 	const nftManagerPositionsContract =
	// 		new Contract(
	// 			NFT_POSITIONS_MANAGER_ADDRESS,
	// 			NonfungiblePositionManagerABI,
	// 			signer,
	// 		) as INonfungiblePositionManager;

	// 	if (
	// 		!tokenId ||
	// 		!walletAddress ||
	// 		!nftManagerPositionsContract ||
	// 		!currentIncentive.key
	// 	)
	// 		return;

	// 	const data = abiEncoder.encode(
	// 		['address', 'address', 'uint', 'uint', 'address'],
	// 		currentIncentive.key,
	// 	);
	// 	const tx = await nftManagerPositionsContract[
	// 		'safeTransferFrom(address,address,uint256,bytes)'
	// 	](
	// 		walletAddress,
	// 		uniswapV3StakerContract.address,
	// 		tokenId,
	// 		data,
	// 		getGasPreference(config.NETWORKS_CONFIG[provider.network.chainId]),
	// 	);

	// 	handleStakeStatus(StakeState.SUBMITTING);
	// 	return tx;
	// } catch (e) {
	// 	console.warn(e);
	// 	captureException(e, {
	// 		tags: {
	// 			section: 'transferStakingNFT',
	// 		},
	// 	});
	// }
	return undefined;
};

export const exit = async (
	tokenId: number | undefined,
	walletAddress: string,
	chainId: number,
	currentIncentive: { key?: (string | number)[] | null },
	handleStakeStatus: Dispatch<SetStateAction<StakeState>>,
): Promise<WriteContractReturnType | undefined> => {
	try {
		console.log(tokenId);
		if (!tokenId || !walletAddress || !currentIncentive.key) return;

		const v3Contract = {
			address: uniswapV3Config.UNISWAP_V3_STAKER,
			abi: UNISWAP_V3_STAKER_ABI,
		};

		// TODO: Handle this
		// const tx = await multicall({
		// 	contracts: [
		// 		{
		// 			...v3Contract,
		// 			functionName: 'unstakeToken',
		// 			args: [
		// 				currentIncentive.key,
		// 				tokenId,
		// 			]
		// 		}
		// 		,
		// 		{
		// 			...v3Contract,
		// 			functionName: 'withdrawToken',
		// 			args: [
		// 				tokenId,
		// 				walletAddress,
		// 				0,
		// 			]
		// 		},
		// 	]
		// });

		handleStakeStatus(StakeState.SUBMITTING);
		// return tx;
		return undefined;
	} catch (e) {
		console.warn(e);
		captureException(e, {
			tags: {
				section: 'exitStakingNFT',
			},
		});
	}
};

export const claimUnstakeStake = async (
	walletAddress: string,
	chainId: number,
	currentIncentive: { key?: (string | number)[] | null },
	stakedPositions: LiquidityPosition[],
): Promise<WriteContractReturnType | undefined> => {
	if (
		!stakedPositions?.length ||
		!walletAddress ||
		!currentIncentive.key ||
		stakedPositions.length === 0
	)
		return;

	const v3Contract = {
		address: uniswapV3Config.UNISWAP_V3_STAKER,
		abi: UNISWAP_V3_STAKER_ABI,
	};

	// TODO: Handle this
	// const data = await multicall({
	// 	contracts: [
	// 		{
	// 			...v3Contract,
	// 			functionName: 'unstakeToken',
	// 			args: [
	// 				currentIncentive.key,
	// 				_tokenId,
	// 			]
	// 		}
	// 		,
	// 		{
	// 			...v3Contract,
	// 			functionName: 'stakeToken',
	// 			args: [
	// 				currentIncentive.key,
	// 				_tokenId,
	// 			]
	// 		},
	// 		{
	// 			...v3Contract,
	// 			functionName: 'claimReward',
	// 			args: [
	// 				currentIncentive.key[0] as string,
	// 				walletAddress,
	// 				0,
	// 			]
	// 		},
	// 	]
	// });

	// const unstakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
	// 	uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
	// 		currentIncentive.key,
	// 		_tokenId,
	// 	]);

	// const stakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
	// 	uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
	// 		currentIncentive.key,
	// 		_tokenId,
	// 	]);

	// const claimRewardCalldata =
	// 	uniswapV3StakerContract.interface.encodeFunctionData('claimReward', [
	// 		currentIncentive.key[0] as string,
	// 		walletAddress,
	// 		0,
	// 	]);

	// const unstakeMulticall = stakedPositions.map(unstakeCalldata);
	// const stakeMulticall = stakedPositions.map(stakeCalldata);

	// const multicallData = unstakeMulticall
	// 	.concat(stakeMulticall)
	// 	.concat(claimRewardCalldata);

	// return await uniswapV3StakerContract.multicall(
	// 	multicallData,
	// 	getGasPreference(config.NETWORKS_CONFIG[chainId]),
	// );
	return undefined;
};

export const claim = async (
	walletAddress: string,
	chainId: number,
	currentIncentive: { key?: (string | number)[] | null },
) => {
	if (!walletAddress || !currentIncentive.key) return;

	try {
		const tx = writeContract(wagmiConfig, {
			address: uniswapV3Config.UNISWAP_V3_STAKER,
			abi: UNISWAP_V3_STAKER_ABI,
			chainId,
			functionName: 'claimReward',
			args: [currentIncentive.key[0] as string, walletAddress, 0],
			// @ts-ignore -- needed for safe txs
			value: 0n,
		});
	} catch (e) {
		console.warn(e);
		captureException(e, {
			tags: {
				section: 'claimStakingNFT',
			},
		});
	}
};

export const stake = async (
	tokenId: number | undefined,
	walletAddress: string,
	chainId: number,
	currentIncentive: { key?: (string | number)[] | null },
) => {
	if (!tokenId || !walletAddress || !currentIncentive.key) return;
	try {
		const tx = writeContract(wagmiConfig, {
			address: uniswapV3Config.UNISWAP_V3_STAKER,
			abi: UNISWAP_V3_STAKER_ABI,
			chainId,
			functionName: 'stakeToken',
			args: [currentIncentive.key, tokenId],
			// @ts-ignore -- needed for safe txs
			value: 0n,
		});
	} catch (e) {
		console.warn(e);
		captureException(e, {
			tags: {
				section: 'stakesNFT',
			},
		});
	}
};

export const getReward = async (
	tokenId: number,
	currentIncentiveKey?: (string | number)[] | null,
): Promise<bigint> => {
	const reward = await readContract(wagmiConfig, {
		address: uniswapV3Config.UNISWAP_V3_STAKER,
		abi: UNISWAP_V3_STAKER_ABI,
		functionName: 'getRewardInfo',
		args: [currentIncentiveKey, tokenId],
	});

	return (reward as bigint) || 0n;
};
