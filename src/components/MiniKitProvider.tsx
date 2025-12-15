import { useEffect, useRef, createContext, useContext, useState } from 'react';

interface MiniKitContextValue {
	isInMiniApp: boolean;
	isLoading: boolean;
	farcasterContext: any | null;
	error: Error | null;
}

const MiniKitContext = createContext<MiniKitContextValue>({
	isInMiniApp: false,
	isLoading: true,
	farcasterContext: null,
	error: null,
});

export const useMiniKitContext = () => useContext(MiniKitContext);

interface MiniKitProviderProps {
	children: React.ReactNode;
}

/**
 * MiniKitProvider - Handles Farcaster Mini App SDK initialization
 *
 * This provider:
 * 1. Detects if running inside Farcaster/Base Mini App
 * 2. Initializes the SDK and calls ready() to hide splash screen
 * 3. Provides context with mini app state
 *
 * Note: Wallet auto-connection is handled separately by FarcasterAutoConnect
 * component which lives inside WagmiProvider
 */
export const MiniKitProvider: React.FC<MiniKitProviderProps> = ({
	children,
}) => {
	const initialized = useRef(false);
	const [isInMiniApp, setIsInMiniApp] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [farcasterContext, setFarcasterContext] = useState<any | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		// Prevent double initialization in React Strict Mode
		if (initialized.current) return;
		initialized.current = true;

		// Only run on client side
		if (typeof window === 'undefined') return;

		console.log('[MiniKit] Initializing...');

		const initMiniApp = async () => {
			try {
				const { sdk } = await import('@farcaster/miniapp-sdk');

				// Check if we're in a mini app environment
				const inMiniApp = await sdk.isInMiniApp();
				setIsInMiniApp(inMiniApp);

				// Store in window for other components to access synchronously
				(window as any).__FARCASTER_MINI_APP__ = inMiniApp;

				if (inMiniApp) {
					console.log(
						'[MiniKit] Running inside Farcaster/Base Mini App',
					);

					// Get the context for user info
					const context = await sdk.context;
					setFarcasterContext(context);

					if (context?.user) {
						console.log(
							'[MiniKit] User FID:',
							context.user.fid,
							'Username:',
							context.user.username,
						);
					}

					// Call ready() to hide splash screen
					await sdk.actions.ready();
					console.log('[MiniKit] ready() called successfully!');

					// Enable back navigation for web history
					try {
						await sdk.back.enableWebNavigation();
						console.log('[MiniKit] Back navigation enabled');
					} catch (backErr) {
						console.debug(
							'[MiniKit] Back navigation not available:',
							backErr,
						);
					}
				} else {
					console.log('[MiniKit] Not running in mini app context');
				}
			} catch (err) {
				console.log('[MiniKit] Error initializing:', err);
				setError(err as Error);
			} finally {
				setIsLoading(false);
			}
		};

		initMiniApp();
	}, []);

	const contextValue: MiniKitContextValue = {
		isInMiniApp,
		isLoading,
		farcasterContext,
		error,
	};

	return (
		<MiniKitContext.Provider value={contextValue}>
			{children}
		</MiniKitContext.Provider>
	);
};

export default MiniKitProvider;
