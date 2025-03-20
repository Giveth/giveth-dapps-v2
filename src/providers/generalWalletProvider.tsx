// create a React provider with the context
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
	PublicKey,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
} from '@solana/web3.js';
import { useBalance, useDisconnect, useAccount, useSwitchChain } from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Chain, formatUnits } from 'viem';
import { utils } from 'ethers';
import { getChainName } from '@/lib/network';
import config from '@/configuration';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import {
	isGIVeconomyRoute as checkIsGIVeconomyRoute,
	sendEvmTransaction,
} from '@/lib/helpers';
import { ChainType } from '@/types/config';
import { signOut } from '@/features/user/user.thunks';
import { wagmiConfig } from '@/wagmiConfigs';
import { getEthersProvider } from '@/helpers/ethers';

const { SOLANA_CONFIG } = config;
const solanaAdapter = SOLANA_CONFIG?.adapterNetwork;

interface IGeneralWalletContext {
	walletChainType: ChainType | null;
	signMessage: (message: string) => Promise<string | undefined>;
	walletAddress: string | null;
	disconnect: () => void;
	isConnected: boolean;
	isConnecting: boolean;
	chainName: string | undefined;
	chain: Chain | WalletAdapterNetwork | undefined;
	openWalletConnectModal: () => void;
	balance?: string;
	sendNativeToken: (
		to: string,
		value: string,
	) => Promise<string | `0x${string}` | undefined>;
	handleSingOutAndSignInWithEVM: () => Promise<void>;
	handleSignOutAndSignInWithSolana: () => Promise<void>;
	handleSignOutAndShowWelcomeModal: () => Promise<void>;
	isOnSolana: boolean;
	isOnEVM: boolean;
	setPendingNetworkId: (id: number | null) => void;
	isContractWallet: boolean;
}
// Create the context
export const GeneralWalletContext = createContext<IGeneralWalletContext>({
	walletChainType: null,
	signMessage: async () => undefined,
	walletAddress: null,
	disconnect: () => {},
	isConnected: false,
	isConnecting: false,
	chainName: undefined,
	chain: undefined,
	openWalletConnectModal: () => {},
	sendNativeToken: async () => undefined,
	handleSingOutAndSignInWithEVM: async () => {},
	handleSignOutAndSignInWithSolana: async () => {},
	handleSignOutAndShowWelcomeModal: async () => {},
	isOnSolana: false,
	isOnEVM: false,
	setPendingNetworkId: () => {},
	isContractWallet: false,
});

const getPhantomSolanaProvider = () => {
	const provider = (window as any)?.solana;
	if (provider?.isPhantom) {
		return provider;
	}
};

// Create the provider component
export const GeneralWalletProvider: React.FC<{
	children: ReactNode;
}> = ({ children }) => {
	// Define the state or any other necessary variables
	const [walletChainType, setWalletChainType] = useState<ChainType | null>(
		null,
	);
	const [pendingNetworkId, setPendingNetworkId] = useState<number | null>(
		null,
	);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [balance, setBalance] = useState<string>();
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [chain, setChain] = useState<
		Chain | WalletAdapterNetwork | undefined
	>(undefined);
	const [chainName, setChainName] = useState<string | undefined>(undefined);
	const [isContractWallet, setIsContractWallet] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { open: openConnectModal } = useWeb3Modal();
	const router = useRouter();
	const { token } = useAppSelector(state => state.user);
	const { setVisible, visible } = useWalletModal();
	const { switchChain } = useSwitchChain();

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
	const { chain: evmChain } = useAccount();

	const { disconnect: ethereumWalletDisconnect } = useDisconnect();
	const nonFormattedEvBalance = useBalance({ address: evmAddress });
	const [solanaBalance, setSolanaBalance] = useState<number>();

	// Solana wallet hooks
	const {
		publicKey,
		disconnect: solanaWalletDisconnect,
		signMessage: solanaSignMessage,
		sendTransaction: solanaSendTransaction,
		connecting: solanaIsConnecting,
		connected: solanaIsConnected,
	} = useWallet();
	const { connection: solanaConnection } = useConnection();

	const signByEvm = async (message: string) => {
		const walletClient = await getWalletClient(wagmiConfig);
		const signature = await walletClient?.signMessage({ message });
		return signature;
	};
	const signBySolana = async (messageToSign: string) => {
		const message = new TextEncoder().encode(messageToSign);

		const signature = await solanaSignMessage?.(message);
		if (!signature) {
			return undefined;
		}
		return utils.base58.encode(signature);
	};

	const getSolanaWalletBalance = async (
		publicKey: PublicKey,
	): Promise<number> => {
		try {
			const balance =
				(await solanaConnection.getBalance(publicKey)) /
				LAMPORTS_PER_SOL;
			return balance;
		} catch (error) {
			console.error('Error getting solana wallet balance:', error);
		}
		return 0;
	};

	const handleSingOutAndSignInWithEVM = async () => {
		await dispatch(signOut(null));
		disconnect();
		openConnectModal();
	};

	const handleSignOutAndSignInWithSolana = async () => {
		await dispatch(signOut(null));
		disconnect();
		setVisible(true);
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
		console.log('publicKey', publicKey);
	}, [publicKey]);
	useEffect(() => {
		console.log('evmChain', evmChain);
	}, [evmChain]);
	useEffect(() => {
		console.log('evmAddress', evmAddress);
	}, [evmAddress]);

	useEffect(() => {
		// TODO: This is a temporary solution. It must be smart when both wallets are connected
		console.log('-- publicKey', publicKey);
		console.log('-- evmChain', evmChain);
		console.log('-- evmAddress', evmAddress);
		if (evmAddress && evmChain) {
			setWalletChainType(ChainType.EVM);
			setWalletAddress(evmAddress);

			// Check if the connected wallet is a smart contract wallet
			checkIsContractWallet(evmAddress).then(isContractWallet => {
				setIsContractWallet(isContractWallet);
				console.log('Is contract wallet:', isContractWallet);
			});
		} else if (publicKey) {
			setWalletChainType(ChainType.SOLANA);
			setWalletAddress(publicKey?.toString());
			// Solana doesn't use ERC-1271, so we set it to false
			setIsContractWallet(false);
		} else {
			setWalletChainType(null);
			setWalletAddress(null);
			setBalance(undefined);
			setIsContractWallet(false); // Reset the state when disconnecting
		}
	}, [evmAddress, evmChain, publicKey]);

	useEffect(() => {
		console.log('walletChainType:', walletChainType);
	}, [walletChainType]);

	useEffect(() => {
		switch (walletChainType) {
			case ChainType.EVM:
				setIsConnected(evmIsConnected);
				setIsConnecting(evmIsConnecting);
				break;
			case ChainType.SOLANA:
				setIsConnected(solanaIsConnected);
				setIsConnecting(solanaIsConnecting);
				break;
			default:
				setIsConnected(false);
				setIsConnecting(false);
				break;
		}
	}, [
		walletChainType,
		evmIsConnected,
		evmIsConnecting,
		solanaIsConnected,
		solanaIsConnecting,
	]);

	useEffect(() => {
		switch (walletChainType) {
			case ChainType.EVM:
				setBalance(
					nonFormattedEvBalance.data?.value
						? formatUnits(
								nonFormattedEvBalance.data?.value,
								nonFormattedEvBalance.data?.decimals,
							)
						: undefined,
				);
				break;
			case ChainType.SOLANA:
				setBalance(solanaBalance?.toString());
				break;
			default:
				setBalance(undefined);
				break;
		}
	}, [walletChainType, nonFormattedEvBalance, solanaBalance]);

	useEffect(() => {
		if (walletChainType === ChainType.EVM && pendingNetworkId !== null) {
			switchChain?.({ chainId: pendingNetworkId });
			setPendingNetworkId(null);
		}
	}, [walletChainType, pendingNetworkId]);

	const signMessage = async (
		message: string,
	): Promise<string | undefined> => {
		switch (walletChainType) {
			case ChainType.EVM:
				return signByEvm(message);
			case ChainType.SOLANA:
				return signBySolana(message);
			default:
				return undefined;
		}
	};

	const sendNativeToken = async (to: string, value: string) => {
		if (!isConnected) throw Error('Wallet is not connected');
		switch (walletChainType) {
			case ChainType.EVM:
				return sendEvmTransaction({
					to: to as `0x${string}`,
					value,
				});
			case ChainType.SOLANA: {
				const lamports = new BigNumber(value)
					.times(LAMPORTS_PER_SOL)
					.toFixed();
				const transaction = new Transaction().add(
					SystemProgram.transfer({
						fromPubkey: publicKey!,
						toPubkey: new PublicKey(to),
						lamports: BigInt(lamports),
					}),
				);
				return await solanaSendTransaction(
					transaction,
					solanaConnection,
				);
			}
			default:
				return;
		}
	};

	const disconnect = () => {
		switch (walletChainType) {
			case ChainType.EVM:
				ethereumWalletDisconnect();
				break;
			case ChainType.SOLANA:
				solanaWalletDisconnect();
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		switch (walletChainType) {
			case ChainType.EVM:
				setChain(evmChain);
				setChainName(getChainName(evmChain?.id));
				break;
			case ChainType.SOLANA:
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
	}, [walletChainType, evmChain]);

	useEffect(() => {
		// If the modal is not visible (closed), it resets the overflow style to 'auto'.
		if (!visible) {
			document.body.style.overflow = 'auto';
			document.body.style.overflow = 'overlay';
		}
	}, [visible]);

	const openWalletConnectModal = () => {
		if (!isGIVeconomyRoute) {
			dispatch(setShowWelcomeModal(true));
		} else {
			disconnect();
			openConnectModal();
		}
	};

	useEffect(() => {
		const solanaProvider = getPhantomSolanaProvider();

		const handleAccountChange = (publicKey: PublicKey) => {
			if (publicKey) {
				const address = publicKey.toBase58();
				setWalletAddress(address);
			}
		};

		if (solanaProvider) {
			solanaProvider.on('accountChanged', handleAccountChange);
		}

		return () => {
			if (solanaProvider) {
				solanaProvider.off('accountChanged', handleAccountChange);
			}
		};
	}, []);

	const isOnSolana = walletChainType === ChainType.SOLANA;
	const isOnEVM = walletChainType === ChainType.EVM;
	const handleSignOutAndShowWelcomeModal = async () => {
		await dispatch(signOut(token!));
		isOnSolana ? solanaWalletDisconnect() : ethereumWalletDisconnect();
		setTimeout(() => {
			dispatch(setShowWelcomeModal(true));
		}, 100); // wait 100 milliseconds (0.1 seconds) before dispatching, because otherwise the modal will not show
	};

	// Function to check if a wallet is a smart contract wallet
	const checkIsContractWallet = async (address: string): Promise<boolean> => {
		try {
			if (!address || !evmChain) return false;

			// First check if the address has code (is a contract)
			const connector = wagmiConfig.connectors[0];
			if (!connector) return false;

			const provider = await getEthersProvider(wagmiConfig);
			if (!provider) return false;

			const code = await provider.getCode(address);

			// If no code, it's an EOA (not a contract wallet)
			if (!code || code === '0x') return false;

			// If it has code, it's a contract wallet
			return true;
		} catch (error) {
			console.error(
				'Error checking if wallet is a contract wallet:',
				error,
			);
			return false;
		}
	};

	const contextValue: IGeneralWalletContext = {
		walletChainType,
		signMessage,
		walletAddress,
		disconnect,
		isConnected,
		isConnecting,
		chainName,
		chain,
		openWalletConnectModal,
		balance,
		sendNativeToken,
		handleSingOutAndSignInWithEVM,
		handleSignOutAndSignInWithSolana,
		handleSignOutAndShowWelcomeModal,
		isOnSolana,
		isOnEVM,
		setPendingNetworkId,
		isContractWallet,
	};

	// Render the provider component with the provided context value
	return (
		<GeneralWalletContext.Provider value={contextValue}>
			{children}
		</GeneralWalletContext.Provider>
	);
};

// export const useGeneralWallet
export const useGeneralWallet = () => {
	const context = useContext(GeneralWalletContext);
	if (context === undefined) {
		throw new Error(
			'useGeneralWallet must be used within a GeneralWalletProvider',
		);
	}
	return context;
};
