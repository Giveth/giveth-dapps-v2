import {
	SimplePoolStakingConfig,
	StakingType,
	UniswapV3PoolStakingConfig,
} from '@/types/config';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import config from '@/configuration';

const uniswapConfig = config.MAINNET_CONFIG.pools.find(
	p => p.type === StakingType.UNISWAP,
) as UniswapV3PoolStakingConfig;

export class SubgraphQueryBuilder {
	static getBalanceQuery = (address: string): string => {
		return `balance(id: "${address.toLowerCase()}") {
			balance
			allocatedTokens
			claimed
			rewardPerTokenPaidGivLm
			rewardsGivLm
			rewardPerTokenPaidSushiSwap
			rewardsSushiSwap
			rewardPerTokenPaidHoneyswap
			rewardsHoneyswap
			rewardPerTokenPaidUniswap
			rewardsUniswap
			rewardPerTokenPaidBalancer
			rewardsBalancer
			givback
			givbackLiquidPart
			balancerLp
			balancerLpStaked
			sushiswapLp
			sushiSwapLpStaked
			honeyswapLp 
			honeyswapLpStaked 
			givStaked
			allocationCount
			givDropClaimed
		}`;
	};

	private static getTokenDistroInfoQuery = (): string => {
		return `tokenDistroContractInfos(first:10){
		  id
		  initialAmount
		  duration
		  startTime
		  cliffTime
		  lockedAmount
		  totalTokens
		}
		`;
	};

	private static getUnipoolInfoQuery = (address: string): string => {
		return `unipoolContractInfo(id: "${address.toLowerCase()}"){
			totalSupply
			lastUpdateTime
			periodFinish
			rewardPerTokenStored
			rewardRate
		}
		`;
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

	private static getUniswapPositionsQuery = (address: string): string => {
		const userPositionsQuery = `userNotStakedPositions: uniswapPositions(where:{owner: "${address.toLowerCase()}",closed:false}){
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

	private static generateUnipoolInfoQueries = (
		configs: SimplePoolStakingConfig[],
	): string => {
		return configs
			.map(
				c =>
					`${c.type}: ${SubgraphQueryBuilder.getUnipoolInfoQuery(
						c.LM_ADDRESS,
					)}`,
			)
			.join();
	};

	static getMainnetQuery = (address: string): string => {
		const uniswapConfig = config.MAINNET_CONFIG.pools.find(
			c => c.type === StakingType.UNISWAP,
		) as UniswapV3PoolStakingConfig;

		return `
		{
			balances: ${SubgraphQueryBuilder.getBalanceQuery(address)}
			tokenDistroInfos: ${SubgraphQueryBuilder.getTokenDistroInfoQuery()}
			${SubgraphQueryBuilder.generateUnipoolInfoQueries([
				getGivStakingConfig(config.MAINNET_CONFIG),
				...config.MAINNET_CONFIG.pools.filter(
					c => c.type !== StakingType.UNISWAP,
				),
			])}
			uniswapV3Pool: ${SubgraphQueryBuilder.getUniswapV3PoolQuery(
				uniswapConfig.UNISWAP_V3_LP_POOL,
			)}
			${SubgraphQueryBuilder.getUniswapPositionsQuery(address)}
		}
		`;
	};

	static getXDaiQuery = (address: string): string => {
		return `
		{
			balances: ${SubgraphQueryBuilder.getBalanceQuery(address)}
			tokenDistroInfos: ${SubgraphQueryBuilder.getTokenDistroInfoQuery()}
			
			${SubgraphQueryBuilder.generateUnipoolInfoQueries([
				getGivStakingConfig(config.XDAI_CONFIG),
				...config.XDAI_CONFIG.pools,
			])}
			
			uniswapV2EthGivPair: ${SubgraphQueryBuilder.getPairInfoQuery(
				config.XDAI_CONFIG.pools.find(
					c => c.type === StakingType.SUSHISWAP,
				)?.POOL_ADDRESS || '',
			)}
		}
		`;
	};
}
