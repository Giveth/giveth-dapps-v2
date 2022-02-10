import { EWallets, torusConnector } from '@/lib/wallet/walletTypes';
import { ethers } from 'ethers';
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask';
import { Web3Provider } from '@ethersproject/providers';
import config from '@/configuration';

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
			(window as any)?.ethereum
				.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x' + chainId.toString(16) }],
				})
				.then();
	}
};

export function isAddressENS(ens: string) {
	return ens.toLowerCase().indexOf('.eth') > -1;
}

export async function getAddressFromENS(ens: string, web3: any) {
	const isEns = isAddressENS(ens);
	if (!isEns) return new Error('Error addressNotENS');

	const address = await web3.ens.getOwner(ens);

	let zeroXAddress = ethers.constants.Zero;

	return address === zeroXAddress
		? new Error('Error gettingAddressFromENS')
		: address;
}

export const switchNetworkHandler = (chainId: number | undefined) => {
	if (!chainId) return;
	if (chainId === config.XDAI_NETWORK_NUMBER) {
		switchNetwork(config.MAINNET_NETWORK_NUMBER);
	} else {
		switchNetwork(config.XDAI_NETWORK_NUMBER);
	}
};
