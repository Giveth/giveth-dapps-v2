import { captureException } from '@sentry/nextjs';
import {
	EWallets,
	torusConnector,
	walletconnectConnector,
} from '@/lib/wallet/walletTypes';
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask';
import config from '@/configuration';
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

export const switchNetwork = async (chainId: number) => {
	const selectedWallet = window.localStorage.getItem(StorageLabel.WALLET);
	switch (selectedWallet) {
		case EWallets.METAMASK:
			await metamaskSwitchNetwork(chainId);
			break;

		case EWallets.TORUS:
			await torusConnector.changeChainId(chainId);
			break;

		case EWallets.WALLETCONNECT:
			await switchWalletConnectNetwork(chainId);
			break;

		default:
			const ethereum = (window as any)?.ethereum;
			if (ethereum) {
				ethereum
					.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: '0x' + chainId.toString(16) }],
					})
					.then();
			} else {
				showToastError('Please connect your wallet');
			}
	}
};

export function isAddressENS(ens: string | undefined) {
	if (!ens) return false;
	return ens?.toLowerCase().indexOf('.eth') > -1;
}

// Before calling getAddressFromENS, check if user is on Mainnet
export async function getAddressFromENS(ens: string | undefined, web3: any) {
	const isEns = isAddressENS(ens);
	if (!isEns) return new Error('Error addressNotENS');
	return await web3.resolveName(ens);
}

export const switchNetworkHandler = (chainId: number | undefined) => {
	if (!chainId) return;
	if (chainId === config.XDAI_NETWORK_NUMBER) {
		switchNetwork(config.MAINNET_NETWORK_NUMBER);
	} else {
		switchNetwork(config.XDAI_NETWORK_NUMBER);
	}
};
