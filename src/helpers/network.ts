import { getChainId, switchChain } from '@wagmi/core';
import { wagmiConfig } from '@/wagmiConfigs';
import config from '@/configuration';

export const ensureCorrectNetwork = async (targetChainId: number) => {
	try {
		const chainId = getChainId(wagmiConfig);
		if (targetChainId === chainId) return true;
		const chain = await switchChain(wagmiConfig, {
			chainId: targetChainId,
		});
		return chain.id === targetChainId;
	} catch (error) {
		console.error('error', error);
		return false;
	}
};

export const getSubgraphChainId = (chainId: number) => {
	const id = config.CHAINS_WITH_SUBGRAPH.find(c => c.id === chainId)?.id;
	return id || config.GNOSIS_NETWORK_NUMBER;
};
