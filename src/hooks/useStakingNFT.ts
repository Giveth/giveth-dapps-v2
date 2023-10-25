import { useCallback, useEffect, useMemo, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useAccount, useNetwork } from 'wagmi';
import config from '@/configuration';
import { getReward } from '@/lib/stakingNFT';
import { LiquidityPosition } from '@/types/nfts';

export const useStakingNFT = (stakedPositions: LiquidityPosition[]) => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { address } = useAccount();
	const [rewardBalance, setRewardBalance] = useState(0n);

	const mainnetConfig = config.MAINNET_CONFIG;
	const uniswapV3Config = mainnetConfig.v3Pools[0];
	const rewardToken = uniswapV3Config.REWARD_TOKEN;
	const poolAddress = uniswapV3Config.UNISWAP_V3_LP_POOL;
	const incentiveRefundeeAddress = uniswapV3Config.INCENTIVE_REFUNDEE_ADDRESS;

	const currentIncentive = useMemo(() => {
		if (
			!rewardToken ||
			!poolAddress ||
			!incentiveRefundeeAddress ||
			!(chainId === config.MAINNET_NETWORK_NUMBER)
		)
			return { key: null };

		const { INCENTIVE_START_TIME, INCENTIVE_END_TIME } = uniswapV3Config;

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
		uniswapV3Config,
	]);

	const checkForRewards = useCallback(() => {
		if (
			!address ||
			!currentIncentive.key ||
			chainId !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const load = async () => {
			try {
				const rewards = await Promise.all(
					stakedPositions.map(({ tokenId }) =>
						getReward(tokenId, currentIncentive.key),
					),
				);

				const allRewards = rewards.reduce(
					(acc: bigint, reward: bigint) => acc + reward,
					0n,
				);
				setRewardBalance(allRewards);
			} catch (error) {
				captureException(error, {
					tags: {
						section: 'checkForRewards',
					},
				});
			}
		};
		load();
	}, [address, chainId, currentIncentive.key, stakedPositions]);

	useEffect(() => {
		if (
			!address ||
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
		address,
		chainId,
		checkForRewards,
		currentIncentive.key,
		stakedPositions,
	]);

	return {
		rewardBalance,
	};
};
