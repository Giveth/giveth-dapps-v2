import { CardanoWalletInfo } from './types';

// Connect user with selected wallet
export const handleWalletSelection = (
	wallet: CardanoWalletInfo,
	setSelectedWallet: (wallet: CardanoWalletInfo) => void,
	connect: (walletName: string) => void,
) => {
	localStorage.setItem('selectedCardanoWallet', JSON.stringify(wallet));
	setSelectedWallet(wallet);
	connect(wallet.name);
};

export const handleWalletDisconnect = (
	disconnect: () => void,
	setSelectedWallet: (wallet: CardanoWalletInfo | undefined) => void,
) => {
	localStorage.removeItem('selectedCardanoWallet');
	setSelectedWallet(undefined);
	disconnect();
};

export const getCardanoStoredWalet = () => {
	const storedCardanoWallet = localStorage.getItem('selectedCardanoWallet');
	if (storedCardanoWallet) {
		return JSON.parse(storedCardanoWallet);
	}
	return null;
};
