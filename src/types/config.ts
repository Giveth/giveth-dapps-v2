export interface BasicStakingConfig {
	LM_ADDRESS: string;
	network: number;
	GARDEN_ADDRESS?: string;
	BUY_LINK?: string;
	farmStartTimeMS?: number;
	farmEndTimeMS?: number;
	icon?: string;
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

export enum RegenFarmType {
	FOX_HNY = 'FOX_HNY_FARM',
	FOX_XDAI = 'FOX_XDAI_FARM',
	CULT_ETH = 'CULT_ETH_FARM',
}

export enum StreamType {
	FOX = 'FOX_STREAM',
	CULT = 'CULT_STREAM',
}

export type PoolStakingConfig =
	| SimplePoolStakingConfig
	| BalancerPoolStakingConfig
	| UniswapV3PoolStakingConfig
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
	active: boolean;
	archived?: boolean;
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
	regenFarmType: RegenFarmType;
}

export interface GasPreference {
	maxFeePerGas?: string;
	maxPriorityFeePerGas?: string;
}

export interface RegenFarmConfig {
	title: string;
	tokenDistroAddress: string;
	type: StreamType;
	rewardTokenAddress: string;
	rewardTokenSymbol: string;
	// For price purpose
	tokenAddressOnUniswapV2: string;
	pools: RegenPoolStakingConfig[];
	introCard?: IntroCardConfig;
}

export interface BasicNetworkConfig {
	TOKEN_ADDRESS: string;
	gGIV_ADDRESS?: string;
	tokenAddressOnUniswapV2: string; // For price purpose in test env, on production this must have the same value of `TOKEN_ADDRESS`
	TOKEN_DISTRO_ADDRESS: string;
	GIV: BasicStakingConfig | SimplePoolStakingConfig;
	nodeUrl: string;
	chainId: string; // A 0x-prefixed hexadecimal string
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string; // 2-6 characters long
		decimals: 18;
	};
	blockExplorerUrls?: string[];
	iconUrls?: string[]; // Currently ignored.
	blockExplorerName: string[];
	subgraphAddress: string;
	gasPreference: GasPreference;
	pools: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| UniswapV3PoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	uniswapV2Subgraph: string;

	regenFarms: RegenFarmConfig[];
}

interface MainnetNetworkConfig extends BasicNetworkConfig {
	WETH_TOKEN_ADDRESS: string;
}
interface XDaiNetworkConfig extends BasicNetworkConfig {
	MERKLE_ADDRESS: string;
}
interface MicroservicesConfig {
	[key: string]: string;
}

export interface EnvConfig {
	MAINNET_NETWORK_NUMBER: number;
	XDAI_NETWORK_NUMBER: number;
	MAINNET_CONFIG: MainnetNetworkConfig;
	XDAI_CONFIG: XDaiNetworkConfig;
	GARDEN_LINK: string;
	BACKEND_LINK: string;
	FRONTEND_LINK: string;
	MICROSERVICES: MicroservicesConfig;
}

export interface GlobalConfig extends EnvConfig {
	TOKEN_NAME: string;
	WEB3_POLLING_INTERVAL: number;
	SUBGRAPH_POLLING_INTERVAL: number;
	NOTIFICATION_POLLING_INTERVAL: number;
	TOKEN_PRECISION: number;
	PRIMARY_NETWORK: any;
	SECONDARY_NETWORK: any;
	NETWORKS_CONFIG: {
		[key: number]: MainnetNetworkConfig | XDaiNetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
	GOOGLE_MAPS_API_KEY: string | undefined;
}
