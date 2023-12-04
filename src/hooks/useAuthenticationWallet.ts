import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { chainNameById } from '@/lib/network';
import config from '@/configuration';

export enum WalletType {
	SOLANA,
	ETHEREUM,
}

export const useAuthenticationWallet = () => {
	const [walletType, setWalletType] = useState<WalletType | null>(null);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	// Wagmi hooks (Ethereum)
	const { address } = useAccount();
	const { chain } = useNetwork();
	const { disconnect: ethereumWalletDisconnect } = useDisconnect();

	// Solana wallet hooks
	const { publicKey, disconnect: solanaWalletDisconnect } = useWallet();

	const signByEvm = async (message: string) => {
		const walletClient = await getWalletClient();
		const signature = await walletClient?.signMessage({ message });
		return signature;
	};
	const signBySolana = async (message: string) => {
		const walletClient = await getWalletClient();
		const signature = await walletClient?.signMessage({ message });
		return signature;
	};

	useEffect(() => {
		// TODO: This is a temporary solution. It must be smart when both wallets are connected
		if (address && chain) {
			setWalletType(WalletType.ETHEREUM);
			setWalletAddress(address);
		} else if (publicKey) {
			setWalletType(WalletType.SOLANA);
			setWalletAddress(publicKey?.toString());
		} else {
			setWalletType(null);
			setWalletAddress(null);
		}
	}, [address, chain, publicKey]);

	const signMessage = async (
		message: string,
	): Promise<string | undefined> => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				return signByEvm(message);
			case WalletType.SOLANA:
				return signBySolana(message);
			default:
				return undefined;
		}
	};

	const disconnect = () => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				ethereumWalletDisconnect();
				break;
			case WalletType.SOLANA:
				solanaWalletDisconnect();
				break;
			default:
				break;
		}
	};

	const getChainName = () => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				return chainNameById(chain?.id);

			case WalletType.SOLANA:
				return (
					'Solana' +
					(config.SOLANA_NETWORK !== WalletAdapterNetwork.Mainnet
						? ` ${config.SOLANA_NETWORK}`
						: '')
				);
			default:
				return '';
		}
	};

	return { walletType, signMessage, walletAddress, disconnect, getChainName };
};
