import React, { FC, ReactNode, createContext, useMemo } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import {
	UnsafeBurnerWalletAdapter,
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base';
import config, { isProduction } from '@/configuration';

require('@solana/wallet-adapter-react-ui/styles.css');

interface IProviderProps {
	children: ReactNode;
}
// Create a context for the provider
export const SolanaCtx = createContext<any>(null);

const wallets: BaseMessageSignerWalletAdapter[] = [
	new PhantomWalletAdapter(),
	new SolflareWalletAdapter({ network: config.SOLANA_NETWORK }),
];

if (!isProduction) {
	wallets.push(new UnsafeBurnerWalletAdapter());
}
// Create the provider component
export const SolanaProvider: FC<IProviderProps> = ({ children }) => {
	const endpoint = useMemo(() => clusterApiUrl(config.SOLANA_NETWORK), []);

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
