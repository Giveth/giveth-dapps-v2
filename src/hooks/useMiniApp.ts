import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { MiniKitContextType } from 'node_modules/@coinbase/onchainkit/dist/minikit/types';
import { FARCASTER_CONNECTOR_ID } from '@/components/FarcasterAutoConnect';

/**
 * Base App Farcaster client fid.
 *
 * Used to distinguish Base App vs Farcaster/Warpcast when running as a Mini App.
 *
 * @see https://docs.base.org/mini-apps/
 */
export const BASE_APP_CLIENT_FID = 309857;
export const BASE_APP_CLIENT_FID_EFFECTIVE =
	process.env.NEXT_PUBLIC_BASE_APP_CLIENT_FID != null
		? Number(process.env.NEXT_PUBLIC_BASE_APP_CLIENT_FID)
		: BASE_APP_CLIENT_FID;

export type MiniAppHost = 'base' | 'farcaster' | null;

// Type for the SDK module - we use dynamic import to avoid SSR issues
// NOTE: We avoid importing types directly from @farcaster/miniapp-sdk at the top level
// because it causes SSR issues on Vercel (ESM module resolution errors)
type FarcasterSDK = Awaited<typeof import('@farcaster/miniapp-sdk')>['sdk'];
type FarcasterContext = Awaited<FarcasterSDK['context']>;
type FarcasterUserContext = NonNullable<FarcasterContext>['user'];

interface MiniAppContext {
	isInMiniApp: boolean;
	isLoading: boolean;
	context: MiniKitContextType['context'] | null;
	user: FarcasterUserContext | null;
	fid: number | null;
	/** Hosting client fid (used to differentiate Base App vs Farcaster clients) */
	clientFid: number | null;
	/** Hosting app (Base vs Farcaster/Warpcast). Null when not in mini app. */
	miniAppHost: MiniAppHost;
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

	// Store SDK reference for use in callbacks (avoid re-importing)
	const sdkRef = useRef<FarcasterSDK | null>(null);

	const [state, setState] = useState<
		Omit<MiniAppContext, 'isFarcasterWalletConnected'>
	>({
		isInMiniApp: false,
		isLoading: true,
		context: null,
		user: null,
		fid: null,
		clientFid: null,
		miniAppHost: null,
	});

	useEffect(() => {
		const initContext = async () => {
			try {
				// Dynamic import to avoid SSR issues - SDK uses browser APIs
				const { sdk } = await import('@farcaster/miniapp-sdk');
				sdkRef.current = sdk;

				const context = await sdk.context;

				if (context) {
					const clientFid =
						(context as any)?.client?.clientFid != null
							? Number((context as any).client.clientFid)
							: null;
					const miniAppHost: MiniAppHost =
						clientFid === BASE_APP_CLIENT_FID_EFFECTIVE
							? 'base'
							: 'farcaster';
					setState({
						isInMiniApp: true,
						isLoading: false,
						context,
						user: context.user || null,
						fid: context.user?.fid || null,
						clientFid,
						miniAppHost,
					});
				} else {
					setState(prev => ({
						...prev,
						isInMiniApp: false,
						isLoading: false,
						clientFid: null,
						miniAppHost: null,
					}));
				}
			} catch (error) {
				console.error('[useMiniApp] Error getting context:', error);
				setState(prev => ({
					...prev,
					isInMiniApp: false,
					isLoading: false,
					clientFid: null,
					miniAppHost: null,
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
			if (state.isInMiniApp && sdkRef.current) {
				await sdkRef.current.actions.openUrl(url);
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
			if (!state.isInMiniApp || !sdkRef.current) {
				console.warn(
					'[useMiniApp] shareText only works inside mini app',
				);
				return;
			}

			await sdkRef.current.actions.composeCast({
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
			if (!state.isInMiniApp || !sdkRef.current) {
				console.warn(
					'[useMiniApp] viewProfile only works inside mini app',
				);
				return;
			}

			await sdkRef.current.actions.viewProfile({ fid });
		},
		[state.isInMiniApp],
	);

	/**
	 * Close the mini app
	 * Only works when running inside the mini app
	 */
	const close = useCallback(async () => {
		if (!state.isInMiniApp || !sdkRef.current) {
			console.warn('[useMiniApp] close only works inside mini app');
			return;
		}

		await sdkRef.current.actions.close();
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
