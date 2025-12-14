'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface MiniKitProviderProps {
	children: React.ReactNode;
}

export const MiniKitProvider: React.FC<MiniKitProviderProps> = ({
	children,
}) => {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (isInitialized) return;

		const initializeMiniKit = async () => {
			try {
				// Check if we're running inside a mini app
				const isInMiniApp = await sdk.isInMiniApp();
				console.log('[MiniKit] isInMiniApp:', isInMiniApp);

				if (isInMiniApp) {
					// Signal that the app is ready to be displayed FIRST
					// This is CRITICAL - without this, the mini app shows a white screen
					await sdk.actions.ready();
					console.log('[MiniKit] App ready signal sent');

					// Then get the context (non-blocking for UI)
					const context = await sdk.context;
					console.log('[MiniKit] Context loaded:', context);
				}
			} catch (error) {
				console.error('[MiniKit] Error initializing:', error);
				// Even on error, try to signal ready to avoid permanent white screen
				try {
					await sdk.actions.ready();
					console.log(
						'[MiniKit] App ready signal sent (error recovery)',
					);
				} catch {
					// Ignore if this also fails - we're not in a mini app context
				}
			} finally {
				setIsInitialized(true);
			}
		};

		initializeMiniKit();
	}, [isInitialized]);

	return <>{children}</>;
};

export default MiniKitProvider;
