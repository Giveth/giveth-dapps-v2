import { useState, useEffect, useCallback } from 'react';
import { sdk, Context } from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';
import { MiniKitContextType } from 'node_modules/@coinbase/onchainkit/dist/minikit/types';
import { FARCASTER_CONNECTOR_ID } from '@/components/FarcasterAutoConnect';

interface MiniAppContext {
	isInMiniApp: boolean;
	isLoading: boolean;
	context: MiniKitContextType['context'] | null;
	user: Context.UserContext | null;
	fid: number | null;
	/** Whether connected with Farcaster smart contract wallet */
	isFarcasterWalletConnected: boolean;
}

interface MiniAppActions {
	openUrl: (url: string) => Promise<void>;
	shareText: (text: string, embeds?: string[]) => Promise<void>;
	viewProfile: (fid: number) => Promise<void>;
	close: () => Promise<void>;
}

interface UseMiniAppReturn extends MiniAppContext {
	actions: MiniAppActions;
}

/**
 * Hook to interact with the Base Mini App SDK
 *
 * Usage:
 * ```tsx
 * const { isInMiniApp, context, user, fid, actions } = useMiniApp();
 *
 * // Check if running in mini app
 * if (isInMiniApp) {
 *   // Use mini app specific features
 *   actions.shareText('Check out Giveth!', ['https://giveth.io']);
 * }
 * ```
 *
 * @see https://docs.base.org/mini-apps/features/sharing-and-social-graph
 */
export function useMiniApp(): UseMiniAppReturn {
	const { isConnected, connector } = useAccount();
	const isFarcasterWalletConnected =
		isConnected && connector?.id === FARCASTER_CONNECTOR_ID;

	const [state, setState] = useState<Omit<MiniAppContext, 'isFarcasterWalletConnected'>>({
		isInMiniApp: false,
		isLoading: true,
		context: null,
		user: null,
		fid: null,
	});

	useEffect(() => {
		const initContext = async () => {
			try {
				const context = await sdk.context;

				if (context) {
					setState({
						isInMiniApp: true,
						isLoading: false,
						context,
						user: context.user || null,
						fid: context.user?.fid || null,
					});
				} else {
					setState(prev => ({
						...prev,
						isInMiniApp: false,
						isLoading: false,
					}));
				}
			} catch (error) {
				console.error('[useMiniApp] Error getting context:', error);
				setState(prev => ({
					...prev,
					isInMiniApp: false,
					isLoading: false,
				}));
			}
		};

		initContext();
	}, []);

	/**
	 * Open an external URL
	 * Uses SDK action if in mini app, otherwise opens in new tab
	 */
	const openUrl = useCallback(
		async (url: string) => {
			if (state.isInMiniApp) {
				await sdk.actions.openUrl(url);
			} else {
				window.open(url, '_blank', 'noopener,noreferrer');
			}
		},
		[state.isInMiniApp],
	);

	/**
	 * Share text/content (compose a cast in Farcaster)
	 * Only works when running inside the mini app
	 */
	const shareText = useCallback(
		async (text: string, embeds?: string[]) => {
			if (!state.isInMiniApp) {
				console.warn(
					'[useMiniApp] shareText only works inside mini app',
				);
				return;
			}

			await sdk.actions.composeCast({
				text,
				// embeds accept max 2 elements
				embeds: embeds?.slice(0, 2) as
					| [string, string]
					| [string]
					| []
					| undefined,
			});
		},
		[state.isInMiniApp],
	);

	/**
	 * View a user's Farcaster profile
	 * Only works when running inside the mini app
	 */
	const viewProfile = useCallback(
		async (fid: number) => {
			if (!state.isInMiniApp) {
				console.warn(
					'[useMiniApp] viewProfile only works inside mini app',
				);
				return;
			}

			await sdk.actions.viewProfile({ fid });
		},
		[state.isInMiniApp],
	);

	/**
	 * Close the mini app
	 * Only works when running inside the mini app
	 */
	const close = useCallback(async () => {
		if (!state.isInMiniApp) {
			console.warn('[useMiniApp] close only works inside mini app');
			return;
		}

		await sdk.actions.close();
	}, [state.isInMiniApp]);

	return {
		...state,
		isFarcasterWalletConnected,
		actions: {
			openUrl,
			shareText,
			viewProfile,
			close,
		},
	};
}

export default useMiniApp;
