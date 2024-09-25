import development from './config/development';
import production from './config/production';
import {
	ChainType,
	GlobalConfig,
	NetworkConfig,
	NonEVMNetworkConfig,
} from './types/config';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
console.log(process.env.NEXT_PUBLIC_DELETE_PROJECT_ENABLED);
export const isDeleteProjectEnabled =
	process.env.NEXT_PUBLIC_DELETE_PROJECT_ENABLED === 'true';

console.log({ isDeleteProjectEnabled });

const envConfig = isProduction ? production : development;

export const SENTRY_URGENT = 'urgent';

export const QF_SPECIFIC_CATEGORIES = ['polygon'];

const EVM_NETWORKS_CONFIG = {
	[envConfig.MAINNET_NETWORK_NUMBER]: envConfig.MAINNET_CONFIG,
	[envConfig.GNOSIS_NETWORK_NUMBER]: envConfig.GNOSIS_CONFIG,
	[envConfig.POLYGON_NETWORK_NUMBER]: envConfig.POLYGON_CONFIG,
	[envConfig.OPTIMISM_NETWORK_NUMBER]: envConfig.OPTIMISM_CONFIG,
	[envConfig.CELO_NETWORK_NUMBER]: envConfig.CELO_CONFIG,
	[envConfig.ARBITRUM_NETWORK_NUMBER]: envConfig.ARBITRUM_CONFIG,
	[envConfig.BASE_NETWORK_NUMBER]: envConfig.BASE_CONFIG,
	[envConfig.CLASSIC_NETWORK_NUMBER]: envConfig.CLASSIC_CONFIG,
	[envConfig.ZKEVM_NETWORK_NUMBER]: envConfig.ZKEVM_CONFIG,
};

const NON_EVM_NETWORKS_CONFIG: { [key: string]: NonEVMNetworkConfig } = {};
const NON_EVM_NETWORKS_CONFIG_WITH_ID: { [key: number]: NonEVMNetworkConfig } =
	{};

NON_EVM_NETWORKS_CONFIG[ChainType.SOLANA] = envConfig.SOLANA_CONFIG;
NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR] = envConfig.STELLAR_CONFIG;
NON_EVM_NETWORKS_CONFIG_WITH_ID[envConfig.SOLANA_CONFIG.networkId] =
	envConfig.SOLANA_CONFIG; // 103
if (!isProduction) {
	// Cause Solana IDs are different in staging BE env
	NON_EVM_NETWORKS_CONFIG_WITH_ID[101] = envConfig.SOLANA_CONFIG;
	NON_EVM_NETWORKS_CONFIG_WITH_ID[102] = envConfig.SOLANA_CONFIG;
}
NON_EVM_NETWORKS_CONFIG_WITH_ID[envConfig.STELLAR_CONFIG.networkId] =
	envConfig.STELLAR_CONFIG;

const config: GlobalConfig = {
	TOKEN_NAME: 'DRGIV',
	WEB3_POLLING_INTERVAL: 15000,
	SUBGRAPH_POLLING_INTERVAL: 300_000,
	SUBGRAPH_UPDATING_UI_INTERVAL: 5000,
	NOTIFICATION_POLLING_INTERVAL: 5000,
	PFP_POLLING_INTERVAL: 2000,
	TOKEN_PRECISION: 2,
	DONATE_TOKEN_PRECISION: 6,
	...envConfig,
	EVM_NETWORKS_CONFIG,
	NON_EVM_NETWORKS_CONFIG,
	NETWORKS_CONFIG: { ...EVM_NETWORKS_CONFIG, ...NON_EVM_NETWORKS_CONFIG },
	NETWORKS_CONFIG_WITH_ID: {
		...EVM_NETWORKS_CONFIG,
		...NON_EVM_NETWORKS_CONFIG_WITH_ID,
	},
	CHAINS_WITH_SUBGRAPH: Object.entries(envConfig)
		.filter(([key, value]) => value?.subgraphAddress)
		.map(([key, value]) => value as NetworkConfig),
	// Used for adding networks to user wallet, useless since just xDAI is not
	// included in metamask by default and its rpc endpoint is not infura
	INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
	BLOCKNATIVE_DAPP_ID: process.env.BLOCKNATIVE_DAPP_ID,
	GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
};

export default config;
