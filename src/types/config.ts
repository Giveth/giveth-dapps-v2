export interface BasicStakingConfig {
	LM_ADDRESS: string;
	network: number;
	GARDEN_ADDRESS?: string;
	BUY_LINK?: string;
	farmStartTimeMS?: number;
	farmEndTimeMS?: number;
	icon?: string;
	exploited?: boolean;
}
export enum StakingPlatform {
	GIVETH = 'Staking',
	UNISWAP = 'Uniswap',
	BALANCER = 'Balancer',
	HONEYSWAP = 'Honeyswap',
	SUSHISWAP = 'Sushiswap',
	ICHI = 'ICHI',
}
export enum StakingType {
	UNISWAPV2_GIV_DAI = 'UniswapV2_GIV_DAI',
	UNISWAPV3_ETH_GIV = 'UniswapV3', // ETH-GIV
	BALANCER_ETH_GIV = 'Balancer', // ETH-GIV
	SUSHISWAP_ETH_GIV = 'Sushiswap', // ETH-GIV
	HONEYSWAP_GIV_HNY = 'Honeyswap_GIV_HNY',
	HONEYSWAP_GIV_DAI = 'Honeyswap_GIV_DAI',
	GIV_LM = 'GIV_LM',
	ICHI_GIV_ONEGIV = 'Ichi_GIV_oneGIV',

	HONEYSWAP_FOX_HNY = 'Honeyswap_FOX_HNY',
	HONEYSWAP_FOX_XDAI = 'Honeyswap_FOX_DAI',
	UNISWAPV2_CULT_ETH = 'UniswapV2_CULT_ETH',
}

export enum StreamType {
	FOX = 'FOX_STREAM',
	CULT = 'CULT_STREAM',
}

export type PoolStakingConfig =
	| SimplePoolStakingConfig
	| BalancerPoolStakingConfig
	// | UniswapV3PoolStakingConfig
	| RegenPoolStakingConfig
	| ICHIPoolStakingConfig;

export interface SimplePoolStakingConfig extends BasicStakingConfig {
	POOL_ADDRESS: string;
	type: StakingType;
	platform: StakingPlatform;
	platformTitle?: string;
	title: string;
	description?: string;
	provideLiquidityLink?: string;
	unit: string;
	introCard?: IntroCardConfig;
}

export interface ICHIPoolStakingConfig extends SimplePoolStakingConfig {
	ichiApi: string;
	platform: StakingPlatform.ICHI;
}

export interface UniswapV3PoolStakingConfig
	extends Omit<SimplePoolStakingConfig, 'LM_ADDRESS' | 'POOL_ADDRESS'> {
	INCENTIVE_START_TIME: number;
	INCENTIVE_END_TIME: number;
	INCENTIVE_REWARD_AMOUNT: number;
	NFT_POSITIONS_MANAGER_ADDRESS: string;
	UNISWAP_V3_STAKER: string;
	STAKING_REWARDS_CONTRACT: string;
	REWARD_TOKEN: string;
	UNISWAP_V3_LP_POOL: string;
	INCENTIVE_REFUNDEE_ADDRESS: string;
	infinitePositionId?: number;
}
export interface BalancerPoolStakingConfig extends SimplePoolStakingConfig {
	VAULT_ADDRESS: string;
	POOL_ID: string;
}

export interface IntroCardConfig {
	icon?: string;
	title: string;
	description: string;
	link: string;
}

export interface RegenPoolStakingConfig extends SimplePoolStakingConfig {
	regenStreamType: StreamType;
}

export interface GasPreference {
	maxFeePerGas?: string;
	maxPriorityFeePerGas?: string;
}

export interface RegenStreamConfig {
	network: number;
	title: string;
	tokenDistroAddress: string;
	type: StreamType;
	rewardTokenAddress: string;
	rewardTokenSymbol: string;
	archived?: boolean;
	// For price purpose
	tokenAddressOnUniswapV2: string;
}

export interface INetworkParam {
	chainId: string;
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorerUrls: Array<string>;
	rpcUrls: Array<string>;
	iconUrls?: Array<string>;
}

export interface BasicNetworkConfig extends INetworkParam {
	nodeUrl: string;
	blockExplorerName: string[];
	gasPreference: GasPreference;
	subgraphAddress: string;
}

export interface SimpleNetworkConfig extends BasicNetworkConfig {
	TOKEN_ADDRESS: string;
	gGIV_ADDRESS?: string;
	tokenAddressOnUniswapV2: string; // For price purpose in test env, on production this must have the same value of `TOKEN_ADDRESS`
	TOKEN_DISTRO_ADDRESS: string;
	GIV: BasicStakingConfig | SimplePoolStakingConfig;
	DAI_CONTRACT_ADDRESS?: string;
	PFP_CONTRACT_ADDRESS?: string;
	pools: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| UniswapV3PoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	regenPools: RegenPoolStakingConfig[];
	uniswapV2Subgraph: string;
	regenStreams: RegenStreamConfig[];
}

interface MainnetNetworkConfig extends SimpleNetworkConfig {
	WETH_TOKEN_ADDRESS: string;
}
interface XDaiNetworkConfig extends SimpleNetworkConfig {
	MERKLE_ADDRESS: string;
}
interface MicroservicesConfig {
	authentication: string;
	notification: string;
	notificationSettings: string;
}

export interface EnvConfig {
	GIVETH_PROJECT_ID: number;
	MAINNET_NETWORK_NUMBER: number;
	XDAI_NETWORK_NUMBER: number;
	POLYGON_NETWORK_NUMBER: number;
	OPTIMISM_NETWORK_NUMBER: number;
	CELO_NETWORK_NUMBER: number;
	MAINNET_CONFIG: MainnetNetworkConfig;
	XDAI_CONFIG: XDaiNetworkConfig;
	POLYGON_CONFIG: BasicNetworkConfig;
	OPTIMISM_CONFIG: BasicNetworkConfig;
	CELO_CONFIG: BasicNetworkConfig;
	GARDEN_LINK: string;
	BASE_ROUTE: string;
	BACKEND_LINK: string;
	FRONTEND_LINK: string;
	MICROSERVICES: MicroservicesConfig;
	RARIBLE_ADDRESS: string;
}

export interface GlobalConfig extends EnvConfig {
	TOKEN_NAME: string;
	WEB3_POLLING_INTERVAL: number;
	SUBGRAPH_POLLING_INTERVAL: number;
	NOTIFICATION_POLLING_INTERVAL: number;
	PFP_POLLING_INTERVAL: number;
	TOKEN_PRECISION: number;
	NETWORKS_CONFIG: {
		[key: number]:
			| MainnetNetworkConfig
			| XDaiNetworkConfig
			| BasicNetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
	GOOGLE_MAPS_API_KEY: string | undefined;
}
