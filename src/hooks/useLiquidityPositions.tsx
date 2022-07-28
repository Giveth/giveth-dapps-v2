import { createContext, useEffect, useMemo, useState } from 'react';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { LiquidityPosition } from '@/types/nfts';
import config from '@/configuration';
import { StakingType, UniswapV3PoolStakingConfig } from '@/types/config';
import { getUniswapV3TokenURI } from '@/services/subgraph.service';
import { Zero } from '@/helpers/number';
import { IUniswapV3Pool, IUniswapV3Position } from '@/types/subgraph';
import { useAppSelector } from '@/features/hooks';
import { APR } from '@/types/poolInfo';

const ERC721NftContext = createContext<{
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: { key?: (string | number)[] | null };
	loadingNftPositions: boolean;
	apr: APR;
	pool: Pool | null;
} | null>(null);

ERC721NftContext.displayName = 'ERC721NftContext';

export const useLiquidityPositions = () => {
	const mainnetValues = useAppSelector(state => state.subgraph.mainnetValues);
	const { chainId, library } = useWeb3React();

	const network = config.MAINNET_NETWORK_NUMBER;
	const userStakedPositions =
		mainnetValues.userStakedPositions as IUniswapV3Position[];
	const userNotStakedPositions =
		mainnetValues.userNotStakedPositions as IUniswapV3Position[];
	const uniswapV3Pool = mainnetValues.uniswapV3Pool as IUniswapV3Pool;

	const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
		[],
	);
	const [unstakedPositions, setUnstakedPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [apr, setApr] = useState<APR>({ effectiveAPR: Zero });
	const [pool, setPool] = useState<Pool | null>(null);

	const [loadingNftPositions, setLoadingNftPositions] = useState(false);

	const mainnetConfig = config.MAINNET_CONFIG;

	const uniswapConfig = mainnetConfig.pools.find(
		c => c.type === StakingType.UNISWAPV3_ETH_GIV,
	) as UniswapV3PoolStakingConfig;
	const rewardToken = uniswapConfig.REWARD_TOKEN;
	const poolAddress = uniswapConfig.UNISWAP_V3_LP_POOL;
	const incentiveRefundeeAddress = uniswapConfig.INCENTIVE_REFUNDEE_ADDRESS;

	const currentIncentive = useMemo(() => {
		if (
			!rewardToken ||
			!poolAddress ||
			!incentiveRefundeeAddress ||
			network !== config.MAINNET_NETWORK_NUMBER
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
		network,
		uniswapConfig,
	]);

	useEffect(() => {
		const loadPositions = async () => {
			const transformToLiquidityPosition = (
				{
					liquidity,
					owner,
					staked,
					tickLower,
					tickUpper,
					tokenId,
				}: IUniswapV3Position,
				pool: Pool,
			): LiquidityPosition | null => {
				try {
					// sdk position
					let _position: Position | null = null;
					if (poolAddress && liquidity) {
						try {
							_position = new Position({
								pool,
								liquidity: liquidity.toString(),
								tickLower: tickLower,
								tickUpper: tickUpper,
							});
						} catch (err) {
							console.log('error', err);
							captureException(err, {
								tags: {
									section: 'transformToLiquidityPosition',
								},
							});
						}
					}

					return {
						owner: owner,
						staked: staked,
						tokenId: tokenId,
						uri: '',
						_position,
					};
				} catch (error) {
					captureException(error, {
						tags: {
							section: 'transformToLiquidityPosition',
						},
					});
					return null;
				}
			};
			try {
				if (!uniswapV3Pool) return;

				setLoadingNftPositions(true);

				const { TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } =
					config.MAINNET_CONFIG;

				const givToken = new Token(
					network,
					TOKEN_ADDRESS,
					18,
					'GIV',
					'GIV',
				);
				const wethToken = new Token(
					network,
					WETH_TOKEN_ADDRESS,
					18,
					'WETH',
					'WETH',
				);

				const givIsToken0 =
					uniswapV3Pool.token0.toLowerCase() ===
					TOKEN_ADDRESS.toLowerCase();

				const _token0: Token = givIsToken0 ? givToken : wethToken;
				const _token1: Token = givIsToken0 ? wethToken : givToken;

				const _pool = new Pool(
					_token0,
					_token1,
					3000,
					uniswapV3Pool.sqrtPriceX96.toString(),
					uniswapV3Pool.liquidity.toString(),
					uniswapV3Pool.tick,
				);

				setPool(_pool);

				const allUserPositions: LiquidityPosition[] = (
					await Promise.all(
						[...userStakedPositions, ...userNotStakedPositions].map(
							positionInfo =>
								transformToLiquidityPosition(
									positionInfo,
									_pool,
								),
						),
					)
				).filter(p => p) as LiquidityPosition[];

				const downloadURI = async (
					position: LiquidityPosition,
				): Promise<any | null> => {
					const { tokenId } = position;
					const key = `nft-${tokenId}-uri`;
					let uri = window.sessionStorage.getItem(key);
					if (!uri) {
						try {
							uri = await getUniswapV3TokenURI(tokenId);
							window.sessionStorage.setItem(key, uri as string);
						} catch (e) {
							console.error(
								'Error on fetching uri of token ' + tokenId,
								e,
							);
							captureException(e, {
								tags: {
									section: 'downloadURI',
								},
							});
						}
					}

					return { ...position, uri };
				};

				const stakedPositions = allUserPositions
					.flat()
					.filter(position => position.staked);

				const stakedPositionsWithURI = await Promise.all(
					stakedPositions.map(downloadURI),
				);

				const unstakedPositions = allUserPositions
					.flat()
					.filter(position => !position.staked);

				const unstakedPositionsWithURI = await Promise.all(
					unstakedPositions.map(downloadURI),
				);

				setStakedPositions(stakedPositionsWithURI);
				setUnstakedPositions(unstakedPositionsWithURI);

				setLoadingNftPositions(false);
			} catch (e) {
				setLoadingNftPositions(false);
				console.log(`getAddressInfo failed: ${e}`);
				captureException(e, {
					tags: {
						section: 'getAddressInfo',
					},
				});
			}
		};
		loadPositions();
	}, [
		userNotStakedPositions,
		userStakedPositions,
		uniswapV3Pool,
		library,
		chainId,
		network,
		poolAddress,
	]);

	return {
		stakedPositions,
		unstakedPositions,
		currentIncentive,
		loadingNftPositions,
		apr,
		pool,
	};
};
