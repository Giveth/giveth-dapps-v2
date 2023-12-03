import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount, useNetwork } from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { useEffect, useState } from 'react';

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

	// Solana wallet hooks
	const { publicKey } = useWallet();

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

	return { walletType, signMessage, walletAddress };
};
