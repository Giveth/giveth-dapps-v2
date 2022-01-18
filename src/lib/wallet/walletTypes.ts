import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
// import { PortisConnector } from '@web3-react/portis-connector';
// import { FortmaticConnector } from '@web3-react/fortmatic-connector';
// import { AuthereumConnector } from '@web3-react/authereum-connector';
import metamaskIcon from '../../../public/images/wallets/metamask.svg';
import walletConnectIcon from '../../../public/images/wallets/walletconnect.svg';
// import portisIcon from '../../../public/images/wallets/portis.svg';
// import fortmaticIcon from '../../../public/images/wallets/fortmatic.svg';
import torusIcon from '../../../public/images/wallets/torus.svg';
// import authereumIcon from '../../../public/images/wallets/authereum.svg';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import config from '@/configuration';
import { TorusConnector } from '@/lib/wallet/torus-connector';

export const injectedConnector = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 100],
});
export const walletconnectConnector = new WalletConnectConnector({
	rpc: { 1: 'https://main-light.eth.linkpool.io' },
	qrcode: true,
});
// export const portisConnector = new PortisConnector({
// 	dAppId: process.env.PORTIS_DAPP_ID as string,
// 	networks: [1, 3, 100],
// });
// export const fortmaticConnector = new FortmaticConnector({
// 	apiKey: process.env.FORTMATIC_API_KEY as string,
// 	chainId: 1,
// });
export const torusConnector = new TorusConnector({
	chainIds: [config.XDAI_NETWORK_NUMBER, config.MAINNET_NETWORK_NUMBER],
});
// torusConnector.supportedChainIds;
// export const authereumConnector = new AuthereumConnector({ chainId: 42 });

export type TWalletConnector =
	// | PortisConnector
	// | FortmaticConnector
	// | AuthereumConnector,
	InjectedConnector | WalletConnectConnector | TorusConnector;

export enum EWallets {
	METAMASK = 'metamask',
	WALLETCONNECT = 'wallet connect',
	PORTIS = 'portis',
	FORTMATIC = 'fortmatic',
	TORUS = 'torus',
	AUTHEREUM = 'authereum',
}

export const walletsArray = [
	{
		name: 'MetaMask',
		value: EWallets.METAMASK,
		image: metamaskIcon,
		connector: injectedConnector,
	},
	{
		name: 'WallectConnect',
		value: EWallets.WALLETCONNECT,
		image: walletConnectIcon,
		connector: walletconnectConnector,
	},
	// {
	// 	name: 'Portis',
	// 	value: EWallets.PORTIS,
	// 	image: portisIcon,
	// 	connector: portisConnector,
	// },
	// {
	// 	name: 'Fortmatic',
	// 	value: EWallets.FORTMATIC,
	// 	image: fortmaticIcon,
	// 	connector: fortmaticConnector,
	// },
	{
		name: 'Torus',
		value: EWallets.TORUS,
		image: torusIcon,
		connector: torusConnector,
	},
	// {
	// 	name: 'Authereum',
	// 	value: EWallets.AUTHEREUM,
	// 	image: authereumIcon,
	// 	connector: authereumConnector,
	// },
];

export const useWalletName = (Web3ReactContext: Web3ReactContextInterface) => {
	const { library, connector } = Web3ReactContext;
	if (connector instanceof WalletConnectConnector)
		return EWallets.WALLETCONNECT;
	// if (connector instanceof PortisConnector) return EWallets.PORTIS;
	// if (connector instanceof FortmaticConnector) return EWallets.FORTMATIC;
	if (connector instanceof TorusConnector) return EWallets.TORUS;
	// if (connector instanceof AuthereumConnector) return EWallets.AUTHEREUM;
	return library?.connection?.url;
};
