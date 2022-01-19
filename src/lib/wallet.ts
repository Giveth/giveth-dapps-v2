import { EWallets, torusConnector } from '@/lib/wallet/walletTypes';
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask';

export const switchNetwork = async (chainId: number) => {
	const selectedWallet = window.localStorage.getItem('selectedWallet');

	switch (selectedWallet) {
		case EWallets.METAMASK:
			await metamaskSwitchNetwork(chainId);
			break;

		case EWallets.TORUS:
			await torusConnector.changeChainId(chainId);
			break;

		default:
			console.log(
				'network change is not supported for wallet ',
				selectedWallet,
			);
	}
};
