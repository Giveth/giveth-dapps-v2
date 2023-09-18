import { captureException } from '@sentry/nextjs';
import { fetchEnsAddress } from '@wagmi/core';
import {
	EWallets,
	torusConnector,
	walletconnectConnector,
} from '@/lib/wallet/walletTypes';
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask';
import StorageLabel from '@/lib/localStorage';
import { showToastError } from './helpers';

// @DEV it's not tested yet! didn't have a multi-chain wallet to test
const switchWalletConnectNetwork = async (chainId: number) => {
	try {
		await walletconnectConnector?.walletConnectProvider?.connector?.updateSession(
			{
				chainId,
				accounts: [],
			},
		);
	} catch (switchError: any) {
		console.error(switchError);
		captureException(switchError, {
			tags: {
				section: 'switchWalletConnectNetwork',
			},
		});
	}
};

export function isAddressENS(ens: string | undefined) {
	if (!ens) return false;
	return ens?.toLowerCase().indexOf('.eth') > -1;
}

// Before calling getAddressFromENS, check if user is on Mainnet
export async function getAddressFromENS(ens: string | undefined) {
	return await fetchEnsAddress({ name: ens! });
}
