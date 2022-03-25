import {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

import { LiquidityPosition } from '@/types/nfts';
import config from '@/configuration';
import { StakingType, UniswapV3PoolStakingConfig } from '@/types/config';
import { useSubgraph } from '.';
import { getUniswapV3TokenURI } from '@/services/subgraph.service';
import { Zero } from '@/helpers/number';
import BigNumber from 'bignumber.js';
import {
	IInfinitePositionReward,
	IUniswapV3Pool,
	IUniswapV3Position,
} from '@/types/subgraph';
import { ethers } from 'ethers';
import { getReward } from '@/lib/stakingNFT';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { useWeb3React } from '@web3-react/core';

const ERC721NftContext = createContext<{
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: { key?: (string | number)[] | null };
	loadingNftPositions: boolean;
	apr: BigNumber;
	minimumApr: BigNumber;
	maxApr: BigNumber;
	pool: Pool | null;
} | null>(null);

const uniswapV3PoolStakingConfig = config.MAINNET_CONFIG.pools.find(
	p => p.type === StakingType.UNISWAP,
) as UniswapV3PoolStakingConfig;

const { INCENTIVE_REWARD_AMOUNT, INCENTIVE_START_TIME, INCENTIVE_END_TIME } =
	uniswapV3PoolStakingConfig || {};

export const NftsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = config.MAINNET_NETWORK_NUMBER;
	const { mainnetValues } = useSubgraph();
	const { chainId, library } = useWeb3React();

	const {
		userStakedPositions,
		userNotStakedPositions,
		allPositions,
		infinitePosition,
		infinitePositionReward,
		uniswapV3Pool,
	} = mainnetValues;

	const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
		[],
	);
	const [unstakedPositions, setUnstakedPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [apr, setApr] = useState<BigNumber>(Zero);
	const [minimumApr, setMinimumApr] = useState<BigNumber>(Zero);
	const [maxApr, setMaxApr] = useState<BigNumber>(Zero);
	const [pool, setPool] = useState<Pool | null>(null);

	const [loadingNftPositions, setLoadingNftPositions] = useState(false);

	const poolLastLiquidity = useRef(ethers.constants.Zero);
	const poolLastTick = useRef(0);
	const lastChainId = useRef(chainId);
	const lastLibrary = useRef(library);

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

	const transformToLiquidityPosition = useCallback(
		(
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
					}
				}

				return {
					owner: owner,
					staked: staked,
					tokenId: tokenId,
					uri: '',
					_position,
				};
			} catch {
				return null;
			}
		},
		[poolAddress],
	);

	const calculateMinApr = useCallback(
		async (
			infinitePosition: IUniswapV3Position | undefined,
			infinitePositionReward: IInfinitePositionReward | undefined,
			_pool: Pool,
			givIsToken0: boolean,
		) => {
			if (
				infinitePosition &&
				infinitePositionReward &&
				chainId === config.MAINNET_NETWORK_NUMBER &&
				library
			) {
				const infiniteLiquidityPosition = transformToLiquidityPosition(
					infinitePosition,
					_pool,
				);
				if (infiniteLiquidityPosition?._position) {
					const { _position } = infiniteLiquidityPosition;

					let infinitePositionLiquidityInGiv;
					if (givIsToken0) {
						// GIV is token0

						// GIV Token
						// let _givToken = _position.pool.token0;

						// amount of giv in LP
						const givAmount = _position.amount0;

						// amount of eth in LP
						const wethAmount = _position.amount1;

						// calc value of ETH in terms of GIV
						const givValueEth =
							_position.pool.token1Price.quote(wethAmount);

						infinitePositionLiquidityInGiv =
							ethers.utils.parseEther(
								givAmount.add(givValueEth).toFixed(),
							);
					} else {
						// WETH is token0

						// amount of giv in LP
						const wethAmount = _position.amount0;

						// amount of eth in LP
						const givAmount = _position.amount1;

						// calc value of ETH in terms of GIV
						const givValueEth =
							_position.pool.token0Price.quote(wethAmount);

						infinitePositionLiquidityInGiv =
							ethers.utils.parseEther(
								givAmount.add(givValueEth).toFixed(),
							);
					}
					const uniswapV3StakerContract =
						getUniswapV3StakerContract(library);

					if (uniswapV3StakerContract) {
						const [currentReward, block]: [
							ethers.BigNumber,
							ethers.providers.Block,
						] = await Promise.all([
							getReward(
								infinitePosition.tokenId,
								uniswapV3StakerContract,
								currentIncentive.key,
							),
							library.getBlock(),
						]);
						const { lastRewardAmount, lastUpdateTimeStamp } =
							infinitePositionReward;
						if (currentReward.gt(lastRewardAmount)) {
							const deltaReward =
								currentReward.sub(lastRewardAmount);
							const deltaTime =
								block.timestamp - lastUpdateTimeStamp;

							const currentApr = new BigNumber(
								deltaReward.toString(),
							)
								.div(infinitePositionLiquidityInGiv.toString())
								.times(31_536_000) // One year
								.div(deltaTime)
								.times(100);
							setMinimumApr(currentApr);
						}
					}
				}
			}
		},
		[chainId, currentIncentive.key, library, transformToLiquidityPosition],
	);

	const calculateAverageApr = useCallback(
		async (
			allPositions: IUniswapV3Position[],
			_pool: Pool,
			givIsToken0: boolean,
		) => {
			const allLiquidityPositions = (await Promise.all(
				allPositions.map(p => transformToLiquidityPosition(p, _pool)),
			)) as LiquidityPosition[];

			const currencyZero = (
				givIsToken0
					? allLiquidityPositions[0]._position?.amount0
					: allLiquidityPositions[0]._position?.amount1
			)?.multiply('0');

			const totalGivValue = allLiquidityPositions
				.flat()
				.reduce((acc, { _position }) => {
					if (!_position) return acc;

					if (
						_position.tickLower > _pool.tickCurrent ||
						_position.tickUpper < _pool.tickCurrent
					) {
						// Out of range
						return acc;
					}

					// In range

					if (givIsToken0) {
						// GIV is token0

						// GIV Token
						// let _givToken = _position.pool.token0;

						// amount of giv in LP
						let givAmount = _position.amount0;

						// amount of eth in LP
						let wethAmount = _position.amount1;

						// calc value of GIV in terms of ETH
						const givEthValue =
							_position.pool.token1Price.quote(wethAmount);

						// add values of all tokens in ETH
						return acc?.add(givEthValue).add(givAmount);
					} else {
						// WETH is token0

						// amount of giv in LP
						let wethAmount = _position.amount0;

						// amount of eth in LP
						let givAmount = _position.amount1;

						// calc value of GIV in terms of ETH
						const givValueEth =
							_position.pool.token0Price.quote(wethAmount);

						// add values of all tokens in ETH
						return acc?.add(givValueEth).add(givAmount);
					}
				}, currencyZero);

			if (totalGivValue) {
				const totalLiquidityGiv = totalGivValue.toFixed(18);

				const currentApr = new BigNumber(INCENTIVE_REWARD_AMOUNT)
					.div(totalLiquidityGiv)
					.times(31_536_000) // One year
					.div(INCENTIVE_END_TIME - INCENTIVE_START_TIME)
					.times(100);

				// Average APR
				setApr(currentApr);
			}
		},
		[transformToLiquidityPosition],
	);

	const calculateMaxPar = useCallback(
		(givIsToken0: boolean, uniswapV3Pool: IUniswapV3Pool) => {
			if (!uniswapV3Pool) return;
			const { tick, liquidity } = uniswapV3Pool;
			const tickBase = 1.0001;

			const tickSpacing = 60; //{ 500: 10, 3000: 60, 10000: 200 }
			const tickToPrice = (tick: number): number => {
				return Math.pow(tickBase, tick);
			};

			// Compute the tick range. This code would work as well in Python: `tick // TICK_SPACING * TICK_SPACING`
			// However, using floor() is more portable.
			const bottomTick = Math.floor(tick / tickSpacing) * tickSpacing;
			const topTick = bottomTick + tickSpacing;

			// Compute the current price and adjust it to a human-readable format
			const price = tickToPrice(tick);
			// Both GIV and WETH decimal values are 18
			// adjusted_price = price / (10 ** (decimals1 - decimals0))

			// Compute square roots of prices corresponding to the bottom and top ticks
			const sa = tickToPrice(Math.floor(bottomTick / 2));
			const sb = tickToPrice(Math.floor(topTick / 2));
			const sp = Math.sqrt(price);

			// Compute real amounts of the two assets
			const amount0 = new BigNumber(liquidity.toString())
				.times(sb - sp)
				.div(sp * sb);
			const amount1 = new BigNumber(liquidity.toString()).times(sp - sa);
			// Compute combined amount of liquidity in token:
			// TODO: check if this price math is correct
			const combinedAmountGiv = givIsToken0
				? amount0.plus(amount1.div(price)).div(10 ** 18)
				: amount1.plus(amount0.div(price)).div(10 ** 18);

			const currentApr = new BigNumber(INCENTIVE_REWARD_AMOUNT)
				.div(combinedAmountGiv)
				.times(31_536_000) // One year
				.div(INCENTIVE_END_TIME - INCENTIVE_START_TIME)
				.times(100);

			// Max APR
			setMaxApr(currentApr);
		},
		[],
	);

	useEffect(() => {
		const loadPositions = async () => {
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

				if (
					!poolLastLiquidity.current.eq(uniswapV3Pool.liquidity) ||
					poolLastTick.current !== uniswapV3Pool.tick ||
					lastChainId.current !== chainId ||
					lastLibrary.current !== library
				) {
					console.log('uniswap pool liquidity is new');

					poolLastLiquidity.current = uniswapV3Pool.liquidity;
					poolLastTick.current = uniswapV3Pool.tick;
					lastChainId.current = chainId;
					lastLibrary.current = library;

					await Promise.all([
						calculateMinApr(
							infinitePosition,
							infinitePositionReward,
							_pool,
							givIsToken0,
						),
						calculateAverageApr(allPositions, _pool, givIsToken0),
					]);
					try {
						calculateMaxPar(givIsToken0, uniswapV3Pool);
					} catch (e) {
						console.error('calculate max apr:', e);
					}
				}

				setLoadingNftPositions(false);
			} catch (e) {
				setLoadingNftPositions(false);
				console.log(`getAddressInfo failed: ${e}`);
			}
		};
		loadPositions();
	}, [
		userNotStakedPositions,
		userStakedPositions,
		allPositions,
		uniswapV3Pool,
		calculateAverageApr,
		calculateMinApr,
		library,
		chainId,
	]);

	//initial load of positions

	return (
		<ERC721NftContext.Provider
			value={{
				stakedPositions,
				unstakedPositions,
				currentIncentive,
				loadingNftPositions,
				apr,
				minimumApr,
				maxApr,
				pool,
			}}
		>
			{children}
		</ERC721NftContext.Provider>
	);
};

export function useLiquidityPositions() {
	const context = useContext(ERC721NftContext);

	if (!context) {
		throw new Error('ERC721 context not found!');
	}

	return context;
}
