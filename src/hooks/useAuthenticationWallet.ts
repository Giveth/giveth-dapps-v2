import { useWallet } from '@solana/wallet-adapter-react';
import {
	PublicKey,
	Connection,
	clusterApiUrl,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
	Chain,
	useAccount,
	useBalance,
	useDisconnect,
	useNetwork,
} from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { useEffect, useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { encodeBase58 } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/router';
import { getChainName } from '@/lib/network';
import config from '@/configuration';
import { useAppDispatch } from '@/features/hooks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { isGIVeconomyRoute as checkIsGIVeconomyRoute } from '@/lib/helpers';
import { ChainType } from '@/types/config';

export enum WalletType {
	SOLANA = ChainType.SOLANA,
	ETHEREUM = 'ETHEREUM',
}

const { SOLANA_CONFIG } = config;
const solanaAdapter = SOLANA_CONFIG?.adapterNetwork;

export const useAuthenticationWallet = () => {
	const [walletType, setWalletType] = useState<WalletType | null>(null);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [balance, setBalance] = useState<string>();
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
	const nonFormatedEvmBalance = useBalance({ address: evmAddress });
	const [solanaBalance, setSolanaBalance] = useState<number>();

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
		return encodeBase58(signature);
	};

	const getSolanaWalletBalance = async (
		publicKey: PublicKey,
	): Promise<number> => {
		// Connect to the cluster
		const connection = new Connection(
			clusterApiUrl(config.SOLANA_CONFIG.adapterNetwork),
			'confirmed',
		);
		// Get the balance
		try {
			const balance =
				(await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
			return balance;
		} catch (error) {
			console.error('Error getting solana wallet balance:', error);
		}
		return 0;
	};

	useEffect(() => {
		let canceled = false;
		if (publicKey) {
			getSolanaWalletBalance(publicKey).then(balance => {
				if (!canceled) {
					setSolanaBalance(balance);
				}
			});
		} else {
			setSolanaBalance(undefined);
		}
		return () => {
			canceled = true;
		};
	}, [publicKey]);

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
			setBalance(undefined);
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

	useEffect(() => {
		switch (walletType) {
			case WalletType.ETHEREUM:
				setBalance(nonFormatedEvmBalance?.data?.formatted || undefined);
				break;
			case WalletType.SOLANA:
				setBalance(solanaBalance?.toString());
				break;
			default:
				setBalance(undefined);
				break;
		}
	}, [walletType, nonFormatedEvmBalance, solanaBalance]);

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
				setChainName(getChainName(evmChain?.id));
				break;
			case WalletType.SOLANA:
				setChain(solanaAdapter);
				setChainName(
					'Solana' +
						(solanaAdapter !== WalletAdapterNetwork.Mainnet
							? ` ${solanaAdapter}`
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
		balance,
	};
};
