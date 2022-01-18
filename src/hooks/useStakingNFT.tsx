import { useCallback, useEffect, useState, useMemo } from 'react';
import { useLiquidityPositions } from '@/context';
import { UniswapV3PoolStakingConfig } from '@/types/config';
import { BigNumber } from '@ethersproject/bignumber';
import config from '@/configuration';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { getReward } from '@/lib/stakingNFT';
import { useWeb3React } from '@web3-react/core';

export const useStakingNFT = () => {
	const { account, chainId, library } = useWeb3React();
	const { stakedPositions } = useLiquidityPositions();

	const [rewardBalance, setRewardBalance] = useState<BigNumber>(
		BigNumber.from(0),
	);

	const mainnetConfig = config.MAINNET_CONFIG;
	const uniswapConfig = mainnetConfig.pools[0] as UniswapV3PoolStakingConfig;
	const rewardToken = uniswapConfig.REWARD_TOKEN;
	const poolAddress = uniswapConfig.UNISWAP_V3_LP_POOL;
	const incentiveRefundeeAddress = uniswapConfig.INCENTIVE_REFUNDEE_ADDRESS;

	const currentIncentive = useMemo(() => {
		if (
			!rewardToken ||
			!poolAddress ||
			!incentiveRefundeeAddress ||
			!(chainId === config.MAINNET_NETWORK_NUMBER)
		)
			return { key: null };

		const { INCENTIVE_START_TIME, INCENTIVE_END_TIME } = uniswapConfig;

		return {
			key: [
				rewardToken,
				poolAddress,
				INCENTIVE_START_TIME,
				INCENTIVE_END_TIME,
				incentiveRefundeeAddress,
			],
		};
	}, [
		rewardToken,
		poolAddress,
		incentiveRefundeeAddress,
		chainId,
		uniswapConfig,
	]);

	const checkForRewards = useCallback(() => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(library);

		if (
			!account ||
			!uniswapV3StakerContract ||
			!currentIncentive.key ||
			chainId !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const load = async () => {
			try {
				const rewards = await Promise.all(
					stakedPositions.map(({ tokenId }) =>
						getReward(
							tokenId,
							uniswapV3StakerContract,
							currentIncentive.key,
						),
					),
				);

				const allRewards = rewards.reduce(
					(acc: BigNumber, reward: BigNumber) => acc.add(reward),
					BigNumber.from(0),
				);
				setRewardBalance(allRewards);
			} catch {}
		};
		load();
	}, [account, chainId, currentIncentive.key, stakedPositions, library]);

	useEffect(() => {
		if (
			!account ||
			!currentIncentive.key ||
			chainId !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const interval = setInterval(() => {
			if (stakedPositions.length > 0) {
				checkForRewards();
			}
		}, 15000);

		checkForRewards();
		return () => {
			clearInterval(interval);
		};
	}, [
		account,
		chainId,
		checkForRewards,
		currentIncentive.key,
		stakedPositions,
	]);

	return {
		rewardBalance,
	};
};
