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

// Network mapping for DRPC
export const getDrpcNetwork = (chainId: number): string | null => {
	const networkMap: { [key: number]: string } = {
		1: 'ethereum',
		137: 'polygon',
		10: 'optimism',
		42161: 'arbitrum',
		8453: 'base',
		42220: 'celo',
		100: 'gnosis',
		1101: 'polygon-zkevm',
		11155111: 'sepolia',
		11155420: 'optimism-sepolia',
		421614: 'arbitrum-sepolia',
		84532: 'base-sepolia',
		44787: 'celo-alfajores',
		1442: 'polygon-zkevm-cardona',
	};

	return networkMap[chainId] || null;
};
