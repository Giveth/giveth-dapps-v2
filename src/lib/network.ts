import config from '@/configuration';

export const chainNameById = (chainId?: number) => {
	const unknown = `Unknown (${chainId})`;
	if (!chainId) return unknown;
	return config.NETWORKS_CONFIG[chainId]?.name || unknown;
};
