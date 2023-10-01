import config from '@/configuration';

export const chainNameById = (chainId?: number) => {
	const unknown = 'Unknown';
	if (!chainId) return unknown;
	return config.NETWORKS_CONFIG[chainId]?.chainName || unknown;
};
