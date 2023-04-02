import development from './config/development';
import production from './config/production';
import { GlobalConfig } from './types/config';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

const envConfig = isProduction ? production : development;

const config: GlobalConfig = {
	TOKEN_NAME: 'DRGIV',
	WEB3_POLLING_INTERVAL: 15000,
	SUBGRAPH_POLLING_INTERVAL: 5000,
	NOTIFICATION_POLLING_INTERVAL: 5000,
	PFP_POLLING_INTERVAL: 2000,
	TOKEN_PRECISION: 2,
	...envConfig,
	NETWORKS_CONFIG: {
		[envConfig.MAINNET_NETWORK_NUMBER]: envConfig.MAINNET_CONFIG,
		[envConfig.XDAI_NETWORK_NUMBER]: envConfig.XDAI_CONFIG,
		[envConfig.POLYGON_NETWORK_NUMBER]: envConfig.POLYGON_CONFIG,
		[envConfig.OPTIMISM_NETWORK_NUMBER]: envConfig.OPTIMISM_CONFIG,
		[envConfig.CELO_NETWORK_NUMBER]: envConfig.CELO_CONFIG,
	},
	// Used for adding networks to user wallet, useless since just xDAI is not
	// included in metamask by default and its rpc endpoint is not infura
	INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
	BLOCKNATIVE_DAPP_ID: process.env.BLOCKNATIVE_DAPP_ID,
	GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
};

config.MAINNET_CONFIG.nodeUrl = process.env.NEXT_PUBLIC_NODE_URL || '';
config.XDAI_CONFIG.nodeUrl = process.env.NEXT_PUBLIC_XDAI_NODE_URL || '';

export default config;
