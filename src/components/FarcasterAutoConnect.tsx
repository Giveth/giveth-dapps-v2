import { useEffect, useRef, useCallback } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useMiniKitContext } from './MiniKitProvider';

/**
 * Farcaster Mini App connector ID from @farcaster/miniapp-wagmi-connector
 */
export const FARCASTER_CONNECTOR_ID = 'farcaster';

/**
 * FarcasterAutoConnect - Automatically connects to Farcaster wallet in mini app context
 *
 * This component should be placed INSIDE WagmiProvider and uses the MiniKitContext
 * to determine if we're running in a Farcaster/Base Mini App environment.
 *
 * When detected as mini app:
 * 1. Finds the Farcaster connector from wagmi config
 * 2. Automatically initiates connection to the in-app Farcaster wallet
 * 3. User doesn't need to manually select a wallet
 *
 * This enables seamless authentication with the smart contract wallet
 * that comes built into Farcaster/Base App.
 */
export const FarcasterAutoConnect: React.FC = () => {
	const { isInMiniApp, isLoading: miniKitLoading } = useMiniKitContext();
	const { isConnected, connector } = useAccount();
	const { connect, connectors, isPending } = useConnect();
	const hasAttemptedConnect = useRef(false);

	const isFarcasterConnected =
		isConnected && connector?.id === FARCASTER_CONNECTOR_ID;

	const autoConnectFarcasterWallet = useCallback(async () => {
		// Don't attempt if already tried, already connected, or pending
		if (hasAttemptedConnect.current || isConnected || isPending) {
			return;
		}

		const farcasterConnector = connectors.find(
			c => c.id === FARCASTER_CONNECTOR_ID,
		);

		if (!farcasterConnector) {
			console.warn(
				'[FarcasterAutoConnect] Farcaster connector not found in wagmi config',
			);
			return;
		}

		hasAttemptedConnect.current = true;

		try {
			console.log(
				'[FarcasterAutoConnect] Auto-connecting to Farcaster wallet...',
			);
			await connect({ connector: farcasterConnector });
			console.log(
				'[FarcasterAutoConnect] Successfully connected to Farcaster wallet!',
			);
		} catch (err) {
			console.error(
				'[FarcasterAutoConnect] Failed to auto-connect:',
				err,
			);
			// Reset flag to allow manual retry if needed
			hasAttemptedConnect.current = false;
		}
	}, [connect, connectors, isConnected, isPending]);

	useEffect(() => {
		// Wait for MiniKit to finish loading
		if (miniKitLoading) {
			return;
		}

		// Only auto-connect if we're in a mini app
		if (!isInMiniApp) {
			console.debug(
				'[FarcasterAutoConnect] Not in mini app, skipping auto-connect',
			);
			return;
		}

		// If already connected with Farcaster, nothing to do
		if (isFarcasterConnected) {
			console.log(
				'[FarcasterAutoConnect] Already connected with Farcaster wallet',
			);
			return;
		}

		// If connected with a different wallet, don't override
		if (isConnected && !isFarcasterConnected) {
			console.log(
				'[FarcasterAutoConnect] Already connected with different wallet, not overriding',
			);
			return;
		}

		// Wait for connectors to be available
		if (connectors.length === 0) {
			return;
		}

		// Attempt auto-connect
		autoConnectFarcasterWallet();
	}, [
		miniKitLoading,
		isInMiniApp,
		isConnected,
		isFarcasterConnected,
		connectors,
		autoConnectFarcasterWallet,
	]);

	// This component doesn't render anything
	return null;
};

export default FarcasterAutoConnect;
