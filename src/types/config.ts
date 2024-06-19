import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ISuperToken } from './superFluid';
import type { Address, Chain } from 'viem';

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
	POOL_ADDRESS: Address;
	type: StakingType;
	LM_ADDRESS: Address;
	GARDEN_ADDRESS?: Address;
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

export interface BalancerPoolStakingConfig extends SimplePoolStakingConfig {
	VAULT_ADDRESS: Address;
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
	tokenDistroAddress: Address;
	type: StreamType;
	rewardTokenAddress: Address;
	rewardTokenSymbol: string;
	archived?: boolean;
	// For price purpose
	tokenAddressOnUniswapV2: Address;
}

export interface NetworkConfig extends Chain {
	gasPreference: GasPreference;
	subgraphAddress?: string;
	coingeckoChainName: string;
	chainLogo: (logoSize?: number) => JSX.Element;
	TOKEN_DISTRO_ADDRESS?: Address;
	pools?: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	regenPools?: RegenPoolStakingConfig[];
	regenStreams?: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS?: Address;
	GIV_BUY_LINK?: string;
	DAI_TOKEN_ADDRESS?: Address;
	DAI_BUY_LINK?: string;
	GIVPOWER?: SimplePoolStakingConfig | GIVpowerGgivStakingConfig;
	gGIV_TOKEN_ADDRESS?: Address;
	PFP_CONTRACT_ADDRESS?: Address;
	tokenAddressOnUniswapV2?: Address; // For price purpose in test env, on production this must have the same value of `GIV_TOKEN_ADDRESS`
	uniswapV2Subgraph?: string;
	WETH_TOKEN_ADDRESS?: Address;
	MERKLE_ADDRESS?: Address;
	chainType: ChainType;
}

export interface GIVpowerGgivStakingConfig extends SimplePoolStakingConfig {
	GARDEN_ADDRESS: Address;
}

export interface MainnetNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	TOKEN_DISTRO_ADDRESS: Address;
	pools: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| ICHIPoolStakingConfig
	>;
	regenPools: RegenPoolStakingConfig[];
	regenStreams: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS: Address;
	GIV_BUY_LINK: string;
	PFP_CONTRACT_ADDRESS: Address;
	DAI_TOKEN_ADDRESS: Address;
	WETH_TOKEN_ADDRESS: Address;
	tokenAddressOnUniswapV2: Address;
	uniswapV2Subgraph: string;
}
export interface GnosisNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	TOKEN_DISTRO_ADDRESS: Address;
	pools: Array<SimplePoolStakingConfig>;
	regenPools: RegenPoolStakingConfig[];
	regenStreams: RegenStreamConfig[];
	GIV_TOKEN_ADDRESS: Address;
	GIV_BUY_LINK: string;
	gGIV_TOKEN_ADDRESS: Address;
	GIVPOWER: GIVpowerGgivStakingConfig;
	MERKLE_ADDRESS: Address;
}

export interface OptimismNetworkConfig extends NetworkConfig {
	subgraphAddress: string;
	anchorRegistryAddress: Address;
	TOKEN_DISTRO_ADDRESS: Address;
	GIVPOWER: SimplePoolStakingConfig;
	GIV_TOKEN_ADDRESS: Address;
	GIV_BUY_LINK: string;
	superFluidSubgraph: string;
	SUPER_FLUID_TOKENS: Array<ISuperToken>;
	GIVETH_ANCHOR_CONTRACT_ADDRESS: Address;
}

interface MicroservicesConfig {
	authentication: string;
	notification: string;
	notificationSettings: string;
}

export interface NonEVMChain {
	id: number;
	networkId: number;
	name: string;
	chainType: ChainType;
	adapterNetwork: WalletAdapterNetwork;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorers: {
		default: {
			name: string;
			url: string;
		};
	};
}

export interface NonEVMNetworkConfig extends NonEVMChain {
	coingeckoChainName: string;
	chainLogo: (logoSize?: number) => JSX.Element;
}

export interface EnvConfig {
	EVM_CHAINS: readonly [Chain, ...Chain[]];
	CHAINS: (Chain | NonEVMChain)[];
	GIVETH_PROJECT_ID: number;
	MAINNET_NETWORK_NUMBER: number;
	GNOSIS_NETWORK_NUMBER: number;
	POLYGON_NETWORK_NUMBER: number;
	OPTIMISM_NETWORK_NUMBER: number;
	CELO_NETWORK_NUMBER: number;
	ARBITRUM_NETWORK_NUMBER: number;
	BASE_NETWORK_NUMBER: number;
	CLASSIC_NETWORK_NUMBER: number;
	ZKEVM_NETWORK_NUMBER: number;
	MAINNET_CONFIG: MainnetNetworkConfig;
	GNOSIS_CONFIG: GnosisNetworkConfig;
	POLYGON_CONFIG: NetworkConfig;
	OPTIMISM_CONFIG: OptimismNetworkConfig;
	CELO_CONFIG: NetworkConfig;
	ARBITRUM_CONFIG: NetworkConfig;
	BASE_CONFIG: NetworkConfig;
	ZKEVM_CONFIG: NetworkConfig;
	CLASSIC_CONFIG: NetworkConfig;
	BACKEND_LINK: string;
	FRONTEND_LINK: string;
	MICROSERVICES: MicroservicesConfig;
	RARIBLE_ADDRESS: string;
	SOLANA_CONFIG: NonEVMNetworkConfig;
}

export interface GlobalConfig extends EnvConfig {
	TOKEN_NAME: string;
	WEB3_POLLING_INTERVAL: number;
	SUBGRAPH_POLLING_INTERVAL: number;
	NOTIFICATION_POLLING_INTERVAL: number;
	PFP_POLLING_INTERVAL: number;
	TOKEN_PRECISION: number;
	DONATE_TOKEN_PRECISION: number;
	EVM_NETWORKS_CONFIG: {
		[key: number]: NetworkConfig;
	};
	NON_EVM_NETWORKS_CONFIG: {
		[key: string]: NonEVMNetworkConfig;
	};
	NETWORKS_CONFIG: {
		[key: number | string]: NetworkConfig | NonEVMNetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
	GOOGLE_MAPS_API_KEY: string | undefined;
}

export enum ChainType {
	SOLANA = 'SOLANA',
	EVM = 'EVM',
}

export interface IChainType {
	chainType?: ChainType;
}
