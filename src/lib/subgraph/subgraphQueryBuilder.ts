import { NetworkConfig, SimplePoolStakingConfig } from '@/types/config';
import config from '@/configuration';

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

	static getIndexedBlockQuery = (): string => {
		return `_meta {
					block {
						number
					}
				}
		`;
	};

	static getBalanceQuery = (
		networkConfig: NetworkConfig,
		userAddress?: string,
	): string => {
		if (!userAddress) return '';
		let query = '';

		if (networkConfig.GIV_TOKEN_ADDRESS) {
			query += SubgraphQueryBuilder.getTokenBalanceQuery(
				networkConfig.GIV_TOKEN_ADDRESS,
				userAddress,
			);
		}

		if (networkConfig.GIVPOWER?.LM_ADDRESS) {
			query += SubgraphQueryBuilder.getTokenBalanceQuery(
				networkConfig.GIVPOWER.LM_ADDRESS,
				userAddress,
			);
		}

		if (networkConfig.gGIV_TOKEN_ADDRESS) {
			query += SubgraphQueryBuilder.getTokenBalanceQuery(
				networkConfig.gGIV_TOKEN_ADDRESS,
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
		networkConfig: NetworkConfig,
		userAddress?: string,
	): string => {
		if (!networkConfig?.TOKEN_DISTRO_ADDRESS) return '';
		const addresses = [networkConfig.TOKEN_DISTRO_ADDRESS];
		if (networkConfig.regenStreams) {
			addresses.push(
				...networkConfig.regenStreams.map(c => c.tokenDistroAddress),
			);
		}
		return addresses
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

	private static getGIVPowersInfoQuery = (lmAddress: string): string => {
		return `givpower(id: "${lmAddress.toLowerCase()}"){
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

	static getChainQuery = (chainId: number, userAddress?: string): string => {
		const networkConfig = config.EVM_NETWORKS_CONFIG[chainId];
		const givpowerConfig = networkConfig?.GIVPOWER;
		return `
		{
			${SubgraphQueryBuilder.getIndexedBlockQuery()}
			${SubgraphQueryBuilder.getBalanceQuery(networkConfig, userAddress)}
			${SubgraphQueryBuilder.generateTokenDistroQueries(networkConfig, userAddress)}
			${SubgraphQueryBuilder.generateFarmingQueries(
				givpowerConfig
					? [
							givpowerConfig,
							...(networkConfig?.pools || []),
							...(networkConfig?.regenPools || []),
						]
					: [
							...(networkConfig?.pools || []),
							...(networkConfig?.regenPools || []),
						],
				userAddress,
			)}
			${
				givpowerConfig?.LM_ADDRESS
					? 'givpowerInfo:' +
						SubgraphQueryBuilder.getGIVPowersInfoQuery(
							givpowerConfig.LM_ADDRESS,
						)
					: ''
			},
		}
		`;
	};
}
