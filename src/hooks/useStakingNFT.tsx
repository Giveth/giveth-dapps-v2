import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { StakingType, UniswapV3PoolStakingConfig } from '@/types/config';
import config from '@/configuration';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { getReward } from '@/lib/stakingNFT';
import { LiquidityPosition } from '@/types/nfts';

export const useStakingNFT = (stakedPositions: LiquidityPosition[]) => {
	const { account, chainId, library } = useWeb3React();

	const [rewardBalance, setRewardBalance] = useState<BigNumber>(
		BigNumber.from(0),
	);

	const mainnetConfig = config.MAINNET_CONFIG;
	const uniswapV3Config = mainnetConfig.pools.find(
		c => c.type === StakingType.UNISWAPV3_ETH_GIV,
	) as UniswapV3PoolStakingConfig;
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
			} catch (error) {
				captureException(error, {
					tags: {
						section: 'checkForRewards',
					},
				});
			}
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
