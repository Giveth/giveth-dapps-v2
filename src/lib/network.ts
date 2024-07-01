import config from '@/configuration';
import { ChainType } from '@/types/config';

export const getChainName = (chainId?: number, chainType?: ChainType) => {
	const unknown = `Unknown (${chainId})`;
	if (!chainId && !chainType) return unknown;
	const nonEvmNetworks = Object.keys(config.NON_EVM_NETWORKS_CONFIG);
	const nonEvmNetwork =
		chainId &&
		nonEvmNetworks.find(
			k => config.NON_EVM_NETWORKS_CONFIG[k].networkId === chainId,
		);
	if (nonEvmNetwork) {
		return config.NON_EVM_NETWORKS_CONFIG[nonEvmNetwork!].name;
	}
	return (
		config.NETWORKS_CONFIG[
			chainType && chainType !== ChainType.EVM ? chainType : chainId!
		]?.name || unknown
	);
};
