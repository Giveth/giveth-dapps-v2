import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
// import { PortisConnector } from '@web3-react/portis-connector';
// import { FortmaticConnector } from '@web3-react/fortmatic-connector';
// import { AuthereumConnector } from '@web3-react/authereum-connector';
import metamaskIcon from '/public//images/wallets/metamask.svg';
// import walletConnectIcon from '/public//images/wallets/walletconnect.svg';
import torusIcon from '/public//images/wallets/torus.svg';
import gnosisIcon from '/public//images/wallets/gnosis.svg';
// import authereumIcon from '/public//images/wallets/authereum.svg';
// import portisIcon from '/public//images/wallets/portis.svg';
// import fortmaticIcon from '/public//images/wallets/fortmatic.svg';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { TorusConnector } from '@/lib/wallet/torus-connector';
import config from '@/configuration';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const supportedChainIds = [1, 3, 4, 5, 42, 100, 137];

export const injectedConnector = new InjectedConnector({});
export const walletconnectConnector = new WalletConnectConnector({
	infuraId: INFURA_API_KEY,
	supportedChainIds,
	qrcode: true,
	rpc: {
		[config.MAINNET_NETWORK_NUMBER]: config.MAINNET_CONFIG.nodeUrl,
		[config.XDAI_NETWORK_NUMBER]: config.XDAI_CONFIG.nodeUrl,
	},
});
export const gnosisSafeConnector = new SafeAppConnector();
// export const portisConnector = new PortisConnector({
// 	dAppId: process.env.PORTIS_DAPP_ID as string,
// 	networks: [1, 3, 100],
// });
// export const fortmaticConnector = new FortmaticConnector({
// 	apiKey: process.env.FORTMATIC_API_KEY as string,
// 	chainId: 1,
// });
export const torusConnector = new TorusConnector({
	chainIds: supportedChainIds,
});
// torusConnector.supportedChainIds;
// export const authereumConnector = new AuthereumConnector({ chainId: 42 });

export type TWalletConnector =
	// | PortisConnector
	// | FortmaticConnector
	// | AuthereumConnector,
	| InjectedConnector
	| WalletConnectConnector
	| TorusConnector
	| SafeAppConnector;

export enum EWallets {
	METAMASK = 'metamask',
	WALLETCONNECT = 'wallet connect',
	PORTIS = 'portis',
	FORTMATIC = 'fortmatic',
	TORUS = 'torus',
	AUTHEREUM = 'authereum',
	GNOSISSAFE = 'gnosis safe',
}

export interface IWallet {
	name: string;
	value: EWallets;
	image: any;
	connector: TWalletConnector;
}

export const torusWallet: IWallet = {
	name: 'Torus',
	value: EWallets.TORUS,
	image: torusIcon,
	connector: torusConnector,
};

export const walletsArray: IWallet[] = [
	{
		name: 'MetaMask',
		value: EWallets.METAMASK,
		image: metamaskIcon,
		connector: injectedConnector,
	},
	// WalletConnect V1 is shutdown. Disabling WalletConnect v1 until v2 is ready
	// {
	// 	name: 'WallectConnect',
	// 	value: EWallets.WALLETCONNECT,
	// 	image: walletConnectIcon,
	// 	connector: walletconnectConnector,
	// },
	torusWallet,
	{
		name: 'GnosisSafe',
		value: EWallets.GNOSISSAFE,
		image: gnosisIcon,
		connector: gnosisSafeConnector,
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
	if (connector instanceof TorusConnector) return EWallets.TORUS;
	if (connector instanceof SafeAppConnector) return EWallets.GNOSISSAFE;
	// if (connector instanceof PortisConnector) return EWallets.PORTIS;
	// if (connector instanceof FortmaticConnector) return EWallets.FORTMATIC;
	// if (connector instanceof AuthereumConnector) return EWallets.AUTHEREUM;
	return library?.connection?.url;
};
