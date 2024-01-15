import config from '@/configuration';
import { ChainType } from '@/types/config';

export const getChainName = (chainId?: number, chainType?: ChainType) => {
	const unknown = `Unknown (${chainId})`;
	if (!chainId && !chainType) return unknown;
	return config.NETWORKS_CONFIG[(chainId || chainType)!]?.name || unknown;
};
