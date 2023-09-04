export interface BasicStakingConfig {}
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
	GIV_GARDEN_LM = 'GIV_GARDEN_LM',
	GIV_UNIPOOL_LM = 'GIV_UNIPOOL_LM',
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

export interface SimplePoolStakingConfig {
	network: number;
	type: StakingType;
	LM_ADDRESS: string;
	POOL_ADDRESS: string;
	GARDEN_ADDRESS?: string;
	BUY_LINK?: string;
	farmStartTimeMS?: number;
	farmEndTimeMS?: number;
	icon?: string;
	exploited?: boolean;
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

export interface NetworkConfig extends INetworkParam {
	nodeUrl: string;
	blockExplorerName: string[];
	gasPreference: GasPreference;
	subgraphAddress?: string;
	coingeckoChainName: string;
	chainLogo: (logoSize?: number) => JSX.Element;
	TOKEN_DISTRO_ADDRESS?: string;
	pools?: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	v3Pools?: Array<UniswapV3PoolStakingConfig>;
	regenPools?: RegenPoolStakingConfig[];
	regenStreams?: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS?: string;
	GIV_BUY_LINK?: string;
	DAI_TOKEN_ADDRESS?: string;
	DAI_BUY_LINK?: string;
	GIVPOWER?: SimplePoolStakingConfig | GIVpowerGgivStakingConfig;
	gGIV_TOKEN_ADDRESS?: string;
	PFP_CONTRACT_ADDRESS?: string;
	tokenAddressOnUniswapV2?: string; // For price purpose in test env, on production this must have the same value of `GIV_TOKEN_ADDRESS`
	uniswapV2Subgraph?: string;
	WETH_TOKEN_ADDRESS?: string;
	MERKLE_ADDRESS?: string;
}

export interface GIVpowerGgivStakingConfig extends SimplePoolStakingConfig {
	GARDEN_ADDRESS: string;
}

export interface MainnetNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	TOKEN_DISTRO_ADDRESS: string;
	pools: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	v3Pools: Array<UniswapV3PoolStakingConfig>;
	regenPools: RegenPoolStakingConfig[];
	regenStreams: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS: string;
	GIV_BUY_LINK: string;
	PFP_CONTRACT_ADDRESS: string;
	DAI_TOKEN_ADDRESS: string;
	WETH_TOKEN_ADDRESS: string;
	tokenAddressOnUniswapV2: string;
	uniswapV2Subgraph: string;
}
export interface GnosisNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	TOKEN_DISTRO_ADDRESS: string;
	pools: Array<SimplePoolStakingConfig>;
	regenPools: RegenPoolStakingConfig[];
	regenStreams: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS: string;
	GIV_BUY_LINK: string;
	gGIV_TOKEN_ADDRESS: string;
	GIVPOWER: GIVpowerGgivStakingConfig;
	MERKLE_ADDRESS: string;
}

export interface OptimismNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	TOKEN_DISTRO_ADDRESS: string;
	GIVPOWER: SimplePoolStakingConfig;
	GIV_TOKEN_ADDRESS: string;
	GIV_BUY_LINK: string;
}

interface MicroservicesConfig {
	authentication: string;
	notification: string;
	notificationSettings: string;
}

export interface EnvConfig {
	GIVETH_PROJECT_ID: number;
	MAINNET_NETWORK_NUMBER: number;
	GNOSIS_NETWORK_NUMBER: number;
	POLYGON_NETWORK_NUMBER: number;
	OPTIMISM_NETWORK_NUMBER: number;
	CELO_NETWORK_NUMBER: number;
	MAINNET_CONFIG: MainnetNetworkConfig;
	GNOSIS_CONFIG: GnosisNetworkConfig;
	POLYGON_CONFIG: NetworkConfig;
	OPTIMISM_CONFIG: OptimismNetworkConfig;
	CELO_CONFIG: NetworkConfig;
	GARDEN_LINK: string;
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
		[key: number]: NetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
	GOOGLE_MAPS_API_KEY: string | undefined;
}
