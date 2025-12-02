'use client';

import { useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface MiniKitProviderProps {
	children: React.ReactNode;
}

// Check if we're running inside a Farcaster/Base mini app context
const isMiniAppEnvironment = (): boolean => {
	if (typeof window === 'undefined') return false;

	// Check for Farcaster/Base app user agent or embedded context
	const userAgent = window.navigator.userAgent.toLowerCase();
	const isInIframe = window.self !== window.top;
	const hasFarcasterUA =
		userAgent.includes('farcaster') || userAgent.includes('warpcast');

	// Check URL params that indicate mini app context
	const urlParams = new URLSearchParams(window.location.search);
	const hasFrameContext =
		urlParams.has('fid') || urlParams.has('miniapp') || urlParams.has('fc');

	return isInIframe || hasFarcasterUA || hasFrameContext;
};

export const MiniKitProvider: React.FC<MiniKitProviderProps> = ({
	children,
}) => {
	const initializeMiniKit = useCallback(async () => {
		// Only initialize if we're in a mini app environment
		if (!isMiniAppEnvironment()) {
			console.log(
				'[MiniKit] Not in mini app environment, skipping initialization',
			);
			return;
		}

		try {
			// Get the context to check if we're in a valid mini app frame
			const context = await sdk.context;

			if (context) {
				console.log('[MiniKit] Context loaded:', context);

				// Signal that the app is ready to be displayed
				await sdk.actions.ready();
				console.log('[MiniKit] App ready signal sent');
			} else {
				console.log('[MiniKit] No frame context available');
			}
		} catch (error) {
			console.error('[MiniKit] Error initializing:', error);
		}
	}, []);

	useEffect(() => {
		initializeMiniKit();
	}, [initializeMiniKit]);

	return <>{children}</>;
};

export default MiniKitProvider;
