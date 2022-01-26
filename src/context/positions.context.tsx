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
import { IUniswapV3Pool, IUniswapV3Position } from '@/types/subgraph';
import { ethers } from 'ethers';

const ERC721NftContext = createContext<{
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: { key?: (string | number)[] | null };
	loadingNftPositions: boolean;
	apr: BigNumber;
	pool: Pool | null;
} | null>(null);

interface IPositionsInfo {
	userPositionInfo: IUniswapV3Position;
	poolInfo: IUniswapV3Pool;
}

export const NftsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = config.MAINNET_NETWORK_NUMBER;
	const { mainnetValues } = useSubgraph();
	const {
		userStakedPositions,
		userNotStakedPositions,
		allPositions,
		uniswapV3Pool,
	} = mainnetValues;

	const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
		[],
	);
	const [unstakedPositions, setUnstakedPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [apr, setApr] = useState<BigNumber>(Zero);
	const [pool, setPool] = useState<Pool | null>(null);

	const [loadingNftPositions, setLoadingNftPositions] = useState(false);

	const poolLastLiquidity = useRef(ethers.constants.Zero);
	const poolLastTick = useRef(0);
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

				const ethPriceInGIV = _pool.priceOf(_pool.token1).toFixed(10);
				// console.log('ethPriceInGIV: ', ethPriceInGIV);

				if (
					!poolLastLiquidity.current.eq(uniswapV3Pool.liquidity) ||
					poolLastTick.current !== uniswapV3Pool.tick
				) {
					console.log('uniswap pool liquidity is new');
					poolLastLiquidity.current = uniswapV3Pool.liquidity;
					poolLastTick.current = uniswapV3Pool.tick;

					const allLiquidityPositions = (await Promise.all(
						allPositions.map(p =>
							transformToLiquidityPosition(p, _pool),
						),
					)) as LiquidityPosition[];

					const totalETHValue = allLiquidityPositions
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
								const ethValueGIV =
									_position.pool.token0Price.quote(givAmount);

								// add values of all tokens in ETH
								return acc?.add(ethValueGIV).add(wethAmount);
							} else {
								// WETH is token0

								// amount of giv in LP
								let wethAmount = _position.amount0;

								// amount of eth in LP
								let givAmount = _position.amount1;

								// calc value of GIV in terms of ETH
								const ethValueGIV =
									_position.pool.token1Price.quote(givAmount);

								// add values of all tokens in ETH
								return acc?.add(ethValueGIV).add(wethAmount);
							}
						}, allLiquidityPositions[0]._position?.amount1.multiply('0'));

					if (totalETHValue) {
						const totalLiquidityEth = totalETHValue.toFixed(18);
						// console.log('totalLiquidityEth:', totalLiquidityEth);

						const uniswapV3PoolStakingConfig =
							config.MAINNET_CONFIG.pools.find(
								p => p.type === StakingType.UNISWAP,
							) as UniswapV3PoolStakingConfig;
						const {
							INCENTIVE_REWARD_AMOUNT,
							INCENTIVE_START_TIME,
							INCENTIVE_END_TIME,
						} = uniswapV3PoolStakingConfig;

						const currentApr = new BigNumber(
							INCENTIVE_REWARD_AMOUNT,
						)
							.div(ethPriceInGIV)
							.div(totalLiquidityEth)
							.times(31_536_000) // One year
							.div(INCENTIVE_END_TIME - INCENTIVE_START_TIME)
							.times(100);

						setApr(currentApr);
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
