import development from './config/development';
import production from './config/production';
import { GlobalConfig } from './types/config';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

const envConfig = isProduction ? production : development;

const config: GlobalConfig = {
	TOKEN_NAME: 'DRGIV',
	WEB3_POLLING_INTERVAL: 15000,
	SUBGRAPH_POLLING_INTERVAL: 5000,
	TOKEN_PRECISION: 2,
	PRIMARY_NETWORK: {
		name: isProduction ? 'Ethereum Mainnet' : 'Ropsten',
		id: isProduction ? 1 : 3,
		chain: isProduction ? '0x1' : '0x3',
		mainToken: 'ETH',
	},
	SECONDARY_NETWORK: {
		name: 'Gnosis Chain',
		id: 100,
		chain: '0x64',
		mainToken: 'XDAI',
	},
	...envConfig,
	NETWORKS_CONFIG: {
		[envConfig.MAINNET_NETWORK_NUMBER]: envConfig.MAINNET_CONFIG,
		[envConfig.XDAI_NETWORK_NUMBER]: envConfig.XDAI_CONFIG,
	},
	XDAI_EXCLUDED_COINS: ['PAN', 'XNODE', 'USDT', 'CRV'],
	// Used for adding netnworks to user wallet, useless since just xDAI is not
	// included in metamask by default and its rpc endpoint is not infura
	INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
	BLOCKNATIVE_DAPP_ID: process.env.BLOCKNATIVE_DAPP_ID,
	GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
};

config.MAINNET_CONFIG.nodeUrl = process.env.NEXT_PUBLIC_NODE_URL || '';
config.XDAI_CONFIG.nodeUrl = process.env.NEXT_PUBLIC_XDAI_NODE_URL || '';

export default config;
