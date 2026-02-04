import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { FARCASTER_CONNECTOR_ID } from '@/components/FarcasterAutoConnect';

/**
 * Check if running inside a Farcaster/Base Mini App environment
 * Uses the SDK's isInMiniApp function for reliable detection
 */
export const checkFarcasterMiniApp = async (): Promise<boolean> => {
	if (typeof window === 'undefined') return false;

	try {
		const { sdk } = await import('@farcaster/miniapp-sdk');
		return await sdk.isInMiniApp();
	} catch (error) {
		console.debug(
			'[Farcaster] Not in mini app environment or SDK not available',
		);
		return false;
	}
};

/**
 * Hook to auto-connect to Farcaster wallet when running inside a Farcaster/Base Mini App
 *
 * This hook automatically detects if the app is running as a mini app inside
 * Farcaster or Base App, and if so, connects to the in-app Farcaster wallet
 * (smart contract wallet) without requiring manual wallet selection.
 *
 * @returns {Object} Object containing:
 *   - isInMiniApp: boolean indicating if running in mini app context
 *   - isConnecting: boolean indicating if currently connecting to wallet
 *   - isAutoConnected: boolean indicating if auto-connection was successful
 */
export function useFarcasterAutoConnect() {
	const { isConnected, connector } = useAccount();
	const { connect, connectors, isPending } = useConnect();
	const [isInMiniApp, setIsInMiniApp] = useState(false);
	const [isAutoConnected, setIsAutoConnected] = useState(false);
	const hasAttemptedConnect = useRef(false);

	useEffect(() => {
		const autoConnect = async () => {
			// Prevent multiple connection attempts
			if (hasAttemptedConnect.current) return;

			// Check if we're in a mini app environment
			const inMiniApp = await checkFarcasterMiniApp();
			setIsInMiniApp(inMiniApp);

			if (!inMiniApp) {
				console.debug(
					'[Farcaster] Not in mini app environment, skipping auto-connect',
				);
				return;
			}

			console.log(
				'[Farcaster] Detected mini app environment, attempting auto-connect',
			);

			// Find the Farcaster connector
			const farcasterConnector = connectors.find(
				c => c.id === FARCASTER_CONNECTOR_ID,
			);

			if (!farcasterConnector) {
				console.warn(
					'[Farcaster] Farcaster connector not found in wagmi config',
				);
				return;
			}

			// If already connected with Farcaster wallet, mark as auto-connected
			if (isConnected && connector?.id === FARCASTER_CONNECTOR_ID) {
				console.log(
					'[Farcaster] Already connected with Farcaster wallet',
				);
				setIsAutoConnected(true);
				return;
			}

			// Attempt to connect
			hasAttemptedConnect.current = true;

			try {
				console.log('[Farcaster] Connecting to Farcaster wallet...');
				await connect({ connector: farcasterConnector });
				console.log(
					'[Farcaster] Successfully connected to Farcaster wallet',
				);
				setIsAutoConnected(true);
			} catch (error) {
				console.error(
					'[Farcaster] Failed to auto-connect to Farcaster wallet:',
					error,
				);
				// Reset flag to allow retry if needed
				hasAttemptedConnect.current = false;
			}
		};

		autoConnect();
	}, [connectors, connect, isConnected, connector]);

	return {
		isInMiniApp,
		isConnecting: isPending,
		isAutoConnected,
	};
}

/**
 * Check if currently running in Farcaster Mini App environment (sync check)
 * This is a simpler check that doesn't use the SDK
 */
export function useIsFarcasterEnvironment(): boolean {
	const [isInMiniApp, setIsInMiniApp] = useState(false);

	useEffect(() => {
		checkFarcasterMiniApp().then(setIsInMiniApp);
	}, []);

	return isInMiniApp;
}

export default useFarcasterAutoConnect;
