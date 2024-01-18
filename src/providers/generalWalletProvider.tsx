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
	Connection,
	clusterApiUrl,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
} from '@solana/web3.js';
import {
	createAssociatedTokenAccountInstruction,
	createTransferInstruction,
	getAssociatedTokenAddress,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
	Chain,
	useAccount,
	useBalance,
	useDisconnect,
	useNetwork,
} from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
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
	sendSolanaSPLToken: (
		to: string,
		value: bigint,
		tokenAddress: string,
	) => Promise<string | undefined>;
	handleSingOutAndSignInWithEVM: () => Promise<void>;
	handleSignOutAndSignInWithSolana: () => Promise<void>;
	handleSignOutAndShowWelcomModal: () => Promise<void>;
	isOnSolana: boolean;
	isOnEVM: boolean;
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
	sendSolanaSPLToken: async () => Promise.resolve(''),
	handleSingOutAndSignInWithEVM: async () => {},
	handleSignOutAndSignInWithSolana: async () => {},
	handleSignOutAndShowWelcomModal: async () => {},
	isOnSolana: false,
	isOnEVM: false,
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
	const { token } = useAppSelector(state => state.user);
	const { setVisible, visible } = useWalletModal();

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
		return ethers.utils.base58.encode(signature);
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

	const handleSingOutAndSignInWithEVM = async () => {
		await dispatch(signOut());
		disconnect();
		openConnectModal();
	};

	const handleSignOutAndSignInWithSolana = async () => {
		await dispatch(signOut());
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
		} else if (publicKey) {
			setWalletChainType(ChainType.SOLANA);
			setWalletAddress(publicKey?.toString());
		} else {
			setWalletChainType(null);
			setWalletAddress(null);
			setBalance(undefined);
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
				setBalance(nonFormattedEvBalance?.data?.formatted || undefined);
				break;
			case ChainType.SOLANA:
				setBalance(solanaBalance?.toString());
				break;
			default:
				setBalance(undefined);
				break;
		}
	}, [walletChainType, nonFormattedEvBalance, solanaBalance]);

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

	const sendSolanaSPLToken = async (
		to: string,
		value: bigint,
		tokenAddress: string,
	) => {
		if (!publicKey) throw Error('Wallet is not connected');
		const splTokenMintAddress = new PublicKey(tokenAddress);
		const receiverAddress = new PublicKey(to);
		const senderTokenAccountAddress = await getAssociatedTokenAddress(
			splTokenMintAddress,
			publicKey,
		);
		const receiverTokenAccountAddress = await getAssociatedTokenAddress(
			splTokenMintAddress,
			receiverAddress,
		);
		const transaction = new Transaction();
		const receiverAccountInfo = await solanaConnection.getAccountInfo(
			receiverTokenAccountAddress,
		);
		if (!receiverAccountInfo) {
			// In the case where user is new to the token and doesn't have an associated token account
			transaction.add(
				createAssociatedTokenAccountInstruction(
					publicKey,
					receiverTokenAccountAddress,
					receiverAddress,
					splTokenMintAddress,
				),
			);
		}
		transaction.add(
			createTransferInstruction(
				senderTokenAccountAddress,
				receiverTokenAccountAddress,
				publicKey,
				value,
				[],
				TOKEN_PROGRAM_ID,
			),
		);
		return await solanaSendTransaction(transaction, solanaConnection);
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
		if (config.ENABLE_SOLANA && !isGIVeconomyRoute) {
			dispatch(setShowWelcomeModal(true));
		} else {
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
	const handleSignOutAndShowWelcomModal = async () => {
		await dispatch(signOut(token!));
		isOnSolana ? solanaWalletDisconnect() : ethereumWalletDisconnect();
		setTimeout(() => {
			dispatch(setShowWelcomeModal(true));
		}, 100); // wait 100 milliseconds (0.1 seconds) before dispatching, because otherwise the modal will not show
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
		sendSolanaSPLToken,
		handleSingOutAndSignInWithEVM,
		handleSignOutAndSignInWithSolana,
		handleSignOutAndShowWelcomModal,
		isOnSolana,
		isOnEVM,
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
