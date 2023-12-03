import React, { FC, ReactNode, createContext, useMemo } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import {
	UnsafeBurnerWalletAdapter,
	PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import config from '@/configuration';

require('@solana/wallet-adapter-react-ui/styles.css');

interface IProviderProps {
	children: ReactNode;
}
// Create a context for the provider
export const SolanaCtx = createContext<any>(null);

// Create the provider component
export const SolanaProvider: FC<IProviderProps> = ({ children }) => {
	const endpoint = useMemo(() => clusterApiUrl(config.SOLANA_NETWORK), []);
	const wallets = useMemo(
		() => [new UnsafeBurnerWalletAdapter(), new PhantomWalletAdapter()],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[config.SOLANA_NETWORK],
	);

	return (
		<SolanaCtx.Provider value={null}>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>{children}</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</SolanaCtx.Provider>
	);
};
