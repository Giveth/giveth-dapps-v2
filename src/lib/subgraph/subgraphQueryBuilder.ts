import {
	SimpleNetworkConfig,
	SimplePoolStakingConfig,
	StakingType,
	UniswapV3PoolStakingConfig,
} from '@/types/config';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import config from '@/configuration';

const uniswapConfig = config.MAINNET_CONFIG.pools.find(
	p => p.type === StakingType.UNISWAPV3_ETH_GIV,
) as UniswapV3PoolStakingConfig;

export class SubgraphQueryBuilder {
	private static getTokenBalanceQuery = (
		tokenAddress: string,
		userAddress?: string,
	): string => {
		if (!userAddress) return '';
		return `tokenBalance_${tokenAddress.toLowerCase()}: tokenBalance(id: "${tokenAddress.toLowerCase()}-${userAddress.toLowerCase()}"){
			balance
		}
		`;
	};

	static getBalanceQuery = (
		{ TOKEN_ADDRESS, gGIV_ADDRESS }: SimpleNetworkConfig,
		userAddress?: string,
	): string => {
		if (!userAddress) return '';
		let query = SubgraphQueryBuilder.getTokenBalanceQuery(
			TOKEN_ADDRESS,
			userAddress,
		);

		if (gGIV_ADDRESS) {
			query += SubgraphQueryBuilder.getTokenBalanceQuery(
				gGIV_ADDRESS,
				userAddress,
			);
		}

		query += SubgraphQueryBuilder.getUserGIVLocked(userAddress);

		return query;
	};

	private static getTokenDistroQueries = (
		tokenDistroAddress: string,
		userAddress?: string,
	): string => {
		return `tokenDistro_${tokenDistroAddress.toLowerCase()}: tokenDistro(id: "${tokenDistroAddress.toLowerCase()}") {
		  id
		  initialAmount
		  duration
		  startTime
		  cliffTime
		  lockedAmount
		  totalTokens
		}
		${
			userAddress
				? `tokenDistroBalance_${tokenDistroAddress.toLowerCase()}: tokenDistroBalance(id: "${tokenDistroAddress.toLowerCase()}-${userAddress.toLowerCase()}") {
			allocatedTokens
			allocationCount
			claimed
			givback
			givDropClaimed
			givbackLiquidPart
			tokenDistroAddress
		}`
				: ``
		}
		
		`;
	};

	private static generateTokenDistroQueries = (
		networkConfig: SimpleNetworkConfig,
		userAddress?: string,
	): string => {
		return [
			networkConfig.TOKEN_DISTRO_ADDRESS,
			...networkConfig.regenStreams.map(c => {
				return c.tokenDistroAddress;
			}),
		]
			.map(tokenDistroAddress =>
				SubgraphQueryBuilder.getTokenDistroQueries(
					tokenDistroAddress,
					userAddress,
				),
			)
			.join('');
	};

	private static getUniswapV3PoolQuery = (address: string): string => {
		return `uniswapV3Pool(id: "${address.toLowerCase()}"){
			token0
			token1
			sqrtPriceX96
			tick
			liquidity
		}`;
	};

	private static getUniswapPositionsQuery = (address?: string): string => {
		const userPositionsQuery = `
		${
			address
				? `userNotStakedPositions: uniswapPositions(where:{owner: "${address.toLowerCase()}",closed:false}){
				tokenId
				token0
				token1
				liquidity
				tickLower
				tickUpper
				staked
				staker
			}
			userStakedPositions: uniswapPositions(where:{staker: "${address.toLowerCase()}"}){
				tokenId
				token0
				token1
				liquidity
				tickLower
				tickUpper
				staked
				staker
			}`
				: ''
		}
		allPositions: uniswapPositions(first: 1000, where: {closed:false}){
			tokenId
			token0
			token1
			liquidity
			tickLower
			tickUpper
			staked
			staker
		}
		`;

		if (uniswapConfig?.infinitePositionId) {
			return (
				userPositionsQuery +
				`infinitePositionRewardInfo: uniswapInfinitePosition(id: ${uniswapConfig.infinitePositionId}) {
    			id
    			lastRewardAmount
  				lastUpdateTimeStamp
  			}
  			infinitePositionInfo: uniswapPosition(id: ${uniswapConfig.infinitePositionId}) {
					tokenId
					token0
					token1
					liquidity
					tickLower
					tickUpper
					staked
					staker
  			}
			`
			);
		}

		return userPositionsQuery;
	};

	private static getPairInfoQuery = (address: string): string => {
		return `pair(id: "${address.toLowerCase()}"){
			token0
			token1
			reserve0
			reserve1
		}
		`;
	};

	private static generateFarmingQueries = (
		configs: Array<SimplePoolStakingConfig>,
		userAddress?: string,
	): string => {
		return configs
			.map((c: SimplePoolStakingConfig) => {
				const unipoolAddressLowerCase = c.LM_ADDRESS.toLowerCase();
				return (
					`
				unipool_${unipoolAddressLowerCase}: unipool(id: "${unipoolAddressLowerCase}") {
					totalSupply
					lastUpdateTime
					periodFinish
					rewardPerTokenStored
					rewardRate
				}
				${
					userAddress
						? `unipoolBalance_${unipoolAddressLowerCase}: unipoolBalance(id: "${unipoolAddressLowerCase}-${userAddress.toLowerCase()}"){
					id
					balance
					rewards
					rewardPerTokenPaid
				}`
						: ''
				}` +
					SubgraphQueryBuilder.getTokenBalanceQuery(
						c.POOL_ADDRESS,
						userAddress,
					)
				);
			})
			.join('');
	};

	private static getGIVPowersInfoQuery = (): string => {
		return `givpower(id: "${config.XDAI_CONFIG.GIV.LM_ADDRESS.toLowerCase()}"){
			id
			initialDate
			locksCreated
			roundDuration
			totalGIVLocked
		}`;
	};

	private static getUserGIVLocked = (userAddress: string): string => {
		return `userGIVLocked: user(id: "${userAddress.toLowerCase()}") {
			givLocked
		  }`;
	};

	static getTokenLocksInfoQuery = (
		userAddress: string,
		first?: number,
		skip?: number,
	): string => {
		return `query { tokenLocks(where:{user: "${userAddress.toLowerCase()}", unlocked: false}, first: ${
			first || 100
		}, skip: ${skip || 0}, orderBy: unlockableAt){ 
			id
			user
			amount
			rounds
			untilRound
			unlockableAt
			unlockedAt
			unlocked
		}}`;
	};

	static getMainnetQuery = (userAddress?: string): string => {
		const uniswapConfig = config.MAINNET_CONFIG.pools.find(
			c => c.type === StakingType.UNISWAPV3_ETH_GIV,
		) as UniswapV3PoolStakingConfig;

		let uniswapV3PoolQuery = '';
		if (uniswapConfig?.UNISWAP_V3_LP_POOL) {
			uniswapV3PoolQuery = `
			uniswapV3Pool: ${SubgraphQueryBuilder.getUniswapV3PoolQuery(
				uniswapConfig.UNISWAP_V3_LP_POOL,
			)}
			`;
		}

		return `query {
			${SubgraphQueryBuilder.getBalanceQuery(config.MAINNET_CONFIG, userAddress)}
			${SubgraphQueryBuilder.generateTokenDistroQueries(
				config.MAINNET_CONFIG,
				userAddress,
			)}
			${SubgraphQueryBuilder.generateFarmingQueries(
				[
					getGivStakingConfig(config.MAINNET_CONFIG),
					...(config.MAINNET_CONFIG.pools.filter(
						c => c.type !== StakingType.UNISWAPV3_ETH_GIV,
					) as Array<SimplePoolStakingConfig>),
					...config.MAINNET_CONFIG.regenPools,
				],
				userAddress,
			)}
			${SubgraphQueryBuilder.getUniswapPositionsQuery(userAddress)}
			${uniswapV3PoolQuery}
		}
		`;
	};

	static getXDaiQuery = (userAddress?: string): string => {
		return `query {
			${SubgraphQueryBuilder.getBalanceQuery(config.XDAI_CONFIG, userAddress)}
			${SubgraphQueryBuilder.generateTokenDistroQueries(
				config.XDAI_CONFIG,
				userAddress,
			)}
			${SubgraphQueryBuilder.generateFarmingQueries(
				[
					getGivStakingConfig(config.XDAI_CONFIG),
					...(config.XDAI_CONFIG
						.pools as Array<SimplePoolStakingConfig>),
					...config.XDAI_CONFIG.regenPools,
				],
				userAddress,
			)}
			givpowerInfo: ${SubgraphQueryBuilder.getGIVPowersInfoQuery()},
		}
		`;
	};
}
