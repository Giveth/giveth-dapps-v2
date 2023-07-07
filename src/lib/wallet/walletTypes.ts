import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import type { Connector } from '@web3-react/types';

import { TorusConnector } from '@/lib/wallet/torus-connector';
import { metaMask } from '@/connectors/metaMask';
import { walletConnectV2 } from '@/connectors/walletConnectV2';
import { gnosisSafe } from '@/connectors/gnosisSafe';

import metamaskIcon from '/public//images/wallets/metamask.svg';
import walletConnectIcon from '/public//images/wallets/walletconnect.svg';
import torusIcon from '/public//images/wallets/torus.svg';
import gnosisIcon from '/public//images/wallets/gnosis.svg';

const supportedChainIds = [1, 3, 4, 5, 42, 100, 137];

export const injectedConnector = metaMask;

export const gnosisSafeConnector = gnosisSafe;

export const torusConnector = new TorusConnector({
	chainIds: supportedChainIds,
});

export type TWalletConnector =
	| MetaMask
	| WalletConnectV2
	| TorusConnector
	| GnosisSafe;

export enum EWallets {
	METAMASK = 'metamask',
	WALLETCONNECT = 'wallet connect',
	TORUS = 'torus',
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
	{
		name: 'WallectConnect',
		value: EWallets.WALLETCONNECT,
		image: walletConnectIcon,
		connector: walletConnectV2,
	},
	torusWallet,
	{
		name: 'GnosisSafe',
		value: EWallets.GNOSISSAFE,
		image: gnosisIcon,
		connector: gnosisSafeConnector,
	},
];

export const useWalletName = (connector: Connector) => {
	if (connector instanceof TorusConnector) return EWallets.TORUS;
	if (connector instanceof MetaMask) return EWallets.METAMASK;
	if (connector instanceof WalletConnectV2) return EWallets.WALLETCONNECT;
	if (connector instanceof GnosisSafe) return EWallets.GNOSISSAFE;
	return 'Unknown';
};
