import { JsonRpcProvider } from '@ethersproject/providers';
import {
	SimpleNetworkConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import config from '../configuration';

const { NETWORKS_CONFIG } = config;

// eslint-disable-next-line no-underscore-dangle
const _networksProviders: {
	[key: number]: JsonRpcProvider;
} = {};

// eslint-disable-next-line no-restricted-syntax,guard-for-in
for (const network in NETWORKS_CONFIG) {
	_networksProviders[network] = new JsonRpcProvider(
		NETWORKS_CONFIG[network].nodeUrl,
	);
}

export const networkProviders = _networksProviders;

export const getGivStakingConfig = (
	networkConfig: SimpleNetworkConfig,
): SimplePoolStakingConfig => {
	return {
		...networkConfig.GIV,
		POOL_ADDRESS: networkConfig.TOKEN_ADDRESS,
		type: StakingType.GIV_LM,
		platform: StakingPlatform.GIVETH,
		title: 'GIV',
		description: '100% GIV',
		unit: 'GIV',
	};
};
