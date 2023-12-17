import { useWallet } from '@solana/wallet-adapter-react';
import { Chain, useAccount, useDisconnect, useNetwork } from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { useEffect, useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/router';
import { base58 } from 'ethers/lib/utils';
import { chainNameById } from '@/lib/network';
import config from '@/configuration';
import { useAppDispatch } from '@/features/hooks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { isGIVeconomyRoute as checkIsGIVeconomyRoute } from '@/lib/helpers';

export enum WalletType {
	SOLANA = 'SOLANA',
	ETHEREUM = 'ETHEREUM',
}

export const useAuthenticationWallet = () => {
	const [walletType, setWalletType] = useState<WalletType | null>(null);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [chain, setChain] = useState<
		Chain | WalletAdapterNetwork | undefined
	>(undefined);
	const [chainName, setChainName] = useState<string | undefined>(undefined);
	const dispatch = useAppDispatch();
	const { open: openConnectModal } = useWeb3Modal();
	const router = useRouter();

	const isGIVeconomyRoute = useMemo(
		() => checkIsGIVeconomyRoute(router.route),
		[router.route],
	);
	// Wagmi hooks (Ethereum)
	const {
		address: evmAddress,
		isConnected: evmIsConnected,
		isConnecting: evmIsConnecting,
	} = useAccount();
	const { chain: evmChain } = useNetwork();
	const { disconnect: ethereumWalletDisconnect } = useDisconnect();

	// Solana wallet hooks
	const {
		publicKey,
		disconnect: solanaWalletDisconnect,
		signMessage: solanaSignMessage,
		connecting: solanaIsConnecting,
		connected: solanaIsConnected,
	} = useWallet();

	const signByEvm = async (message: string) => {
		const walletClient = await getWalletClient();
		const signature = await walletClient?.signMessage({ message });
		return signature;
	};
	const signBySolana = async (messageToSign: string) => {
		const message = new TextEncoder().encode(messageToSign);

		const signature = await solanaSignMessage?.(message);
		if (!signature) {
			return undefined;
		}
		return base58.encode(signature);
	};

	useEffect(() => {
		// TODO: This is a temporary solution. It must be smart when both wallets are connected
		if (evmAddress && evmChain) {
			setWalletType(WalletType.ETHEREUM);
			setWalletAddress(evmAddress);
		} else if (publicKey) {
			setWalletType(WalletType.SOLANA);
			setWalletAddress(publicKey?.toString());
		} else {
			setWalletType(null);
			setWalletAddress(null);
		}
	}, [evmAddress, evmChain, publicKey]);

	useEffect(() => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				setIsConnected(evmIsConnected);
				setIsConnecting(evmIsConnecting);
				break;
			case WalletType.SOLANA:
				setIsConnected(solanaIsConnected);
				setIsConnecting(solanaIsConnecting);
				break;
			default:
				setIsConnected(false);
				setIsConnecting(false);
				break;
		}
	}, [
		walletType,
		evmIsConnected,
		evmIsConnecting,
		solanaIsConnected,
		solanaIsConnecting,
	]);

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

	useEffect(() => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				setChain(evmChain);
				setChainName(chainNameById(evmChain?.id));
				break;
			case WalletType.SOLANA:
				setChain(config.SOLANA_NETWORK);
				setChainName(
					'Solana' +
						(config.SOLANA_NETWORK !== WalletAdapterNetwork.Mainnet
							? ` ${config.SOLANA_NETWORK}`
							: ''),
				);
				break;
			default:
				setChain(undefined);
				setChainName('');
				break;
		}
	}, [walletType, evmChain]);

	const openWalletConnectModal = () => {
		if (config.ENABLE_SOLANA && !isGIVeconomyRoute) {
			dispatch(setShowWelcomeModal(true));
		} else {
			openConnectModal();
		}
	};

	return {
		walletType,
		signMessage,
		walletAddress,
		disconnect,
		isConnected,
		isConnecting,
		chainName,
		chain,
		openWalletConnectModal,
	};
};
