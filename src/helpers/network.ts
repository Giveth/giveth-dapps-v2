import { getChainId, switchChain } from '@wagmi/core';
import { Chain } from 'viem';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { wagmiConfig } from '@/wagmiConfigs';
import config from '@/configuration';
import { ChainType } from '@/types/config';

/**
 * Resolve the network id a donation flow should treat as "current".
 * EVM wallets have a numeric chain id, Solana wallets map to the configured
 * Solana network id, and the Stellar (QR) flow is not tied to a wallet at
 * all. Single source of truth for QF round eligibility checks — keep
 * DonateModal, EligibilityBadges and the QF round selection in sync.
 */
export const getDonationNetworkId = (
	chain: Chain | WalletAdapterNetwork | undefined,
	walletChainType: ChainType | null,
	isStellar: boolean = false,
): number | undefined => {
	if (isStellar) return config.STELLAR_NETWORK_NUMBER;
	if (walletChainType === ChainType.SOLANA)
		return config.SOLANA_CONFIG.networkId;
	return (chain as Chain)?.id;
};

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
