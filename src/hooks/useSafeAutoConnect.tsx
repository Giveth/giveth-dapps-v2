import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

/**
 * Check if running inside Gnosis Safe iframe
 */
const checkGnosisSafe = () => {
	try {
		if (typeof window !== 'undefined' && window.self !== window.top) {
			const parentUrl = window.location.ancestorOrigins[0];
			if (parentUrl) {
				const parsedUrl = new URL(parentUrl);
				const isSafe = parsedUrl.hostname.includes('safe');
				return isSafe;
			} else {
				return false;
			}
		}
	} catch (error) {
		console.error('Error checking Gnosis Safe:', error);
		return false;
	}
};

/**
 * Check if running inside Farcaster Mini App
 * Uses the flag set by MiniKitProvider for synchronous access
 */
const checkFarcasterMiniApp = (): boolean => {
	if (typeof window === 'undefined') return false;
	return !!(window as any).__FARCASTER_MINI_APP__;
};

/**
 * Hook to auto-connect to Gnosis Safe wallet when running inside Safe iframe
 *
 * Note: This hook will skip auto-connection if we're in a Farcaster Mini App,
 * as the FarcasterAutoConnect component handles wallet connection in that case.
 */
function useSafeAutoConnect() {
	const { address } = useAccount();
	const { connect, connectors } = useConnect();

	useEffect(() => {
		const autoConnect = async () => {
			// Skip Safe auto-connect if we're in a Farcaster Mini App
			// The FarcasterAutoConnect component handles wallet connection there
			if (checkFarcasterMiniApp()) {
				console.debug(
					'[useSafeAutoConnect] In Farcaster Mini App, skipping Safe auto-connect',
				);
				return;
			}

			const safeConnector = connectors.find(
				connector => connector.id === 'safe',
			);
			const isGnosisSafeIframe = checkGnosisSafe();

			if (safeConnector && isGnosisSafeIframe) {
				try {
					await connect({ connector: safeConnector });
				} catch (error) {
					console.error('Failed to connect with Gnosis Safe:', error);
				}
			}
		};

		autoConnect();
	}, [address, connectors]);
}

/**
 * Hook to check if running in Gnosis Safe environment
 */
function useIsSafeEnvironment() {
	const isGnosisSafeIframe = checkGnosisSafe();
	return !!isGnosisSafeIframe;
}

/**
 * Hook to check if running in Farcaster Mini App environment
 */
function useIsFarcasterEnvironment(): boolean {
	return checkFarcasterMiniApp();
}

export { useSafeAutoConnect, useIsSafeEnvironment, useIsFarcasterEnvironment };
