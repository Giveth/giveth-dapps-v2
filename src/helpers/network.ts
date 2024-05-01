import { getChainId, switchChain } from '@wagmi/core';
import { wagmiConfig } from '@/wagmiConfigs';

export const ensureCorrectNetwork = async (targetChainId: number) => {
	try {
		const chainId = getChainId(wagmiConfig);
		if (targetChainId === chainId) return true;
		const chain = await switchChain(wagmiConfig, {
			chainId: targetChainId,
		});
		return chain.id === targetChainId;
	} catch (error) {
		console.log('error', error);
		return false;
	}
};
