import React, { useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { Provider as ReduxProvider } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { WagmiProvider } from 'wagmi';
import { ThirdwebProvider } from 'thirdweb/react';
import { projectId, wagmiConfig } from '@/wagmiConfigs';
import { useApollo } from '@/apollo/apolloClient';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';
import '../styles/globals.css';
import { ct, en, es } from '../lang';
import { store } from '@/features/store';
import SubgraphController from '@/components/controller/subgraph.ctrl';
import UserController from '@/components/controller/user.ctrl';
import ModalController from '@/components/controller/modal.ctrl';
import GeneralController from '@/components/controller/general.ctrl';
import NotificationController from '@/components/controller/pfp.ctrl';
import PfpController from '@/components/controller/notification.ctrl';
import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';
import StorageLabel from '@/lib/localStorage';
import { useSafeAutoConnect } from '@/hooks/useSafeAutoConnect';
import {
	getLocaleFromIP,
	getLocaleFromNavigator,
	isGIVeconomyRoute,
} from '@/lib/helpers';
import { GeneralWalletProvider } from '@/providers/generalWalletProvider';
import GIVeconomyTab from '@/components/GIVeconomyTab';
import { zIndex } from '@/lib/constants/constants';
import configuration, { isProduction } from '@/configuration';
import MaintenanceIndex from '@/components/views/Errors/MaintenanceIndex';
import { SolanaProvider } from '@/providers/solanaWalletProvider';
import type { AppProps } from 'next/app';

// Dynamically import MiniKitProvider with SSR disabled to prevent SDK issues
const MiniKitProvider = dynamic(
	() =>
		import('@/components/MiniKitProvider').then(mod => mod.MiniKitProvider),
	{ ssr: false },
);

// Dynamically import FarcasterAutoConnect to handle automatic wallet connection in mini app
const FarcasterAutoConnect = dynamic(
	() =>
		import('@/components/FarcasterAutoConnect').then(
			mod => mod.FarcasterAutoConnect,
		),
	{ ssr: false },
);

if (!isProduction) {
	// Adds messages only in a dev environment
	loadDevMessages();
	loadErrorMessages();
}

declare global {
	interface Window {
		analytics: any;
		gtag: any;
	}
}

const queryClient = new QueryClient();

export const IntlMessages = {
	ct,
	en,
	es,
};

const defaultLocale = process.env.defaultLocale;

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined' && isProduction) {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
		api_host:
			process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
		person_profiles: 'identified_only',
		// Enable debug mode in development
		loaded: posthog => {
			if (process.env.NODE_ENV === 'development') posthog.debug();
		},
	});
}

const RenderComponent = ({ Component, pageProps }: any) => {
	useSafeAutoConnect();
	return <Component {...pageProps} />;
};

// Create web3 modal
createWeb3Modal({
	wagmiConfig,
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
	themeVariables: {
		'--w3m-z-index': zIndex.WEB3MODAL,
	},
	chainImages: {
		[configuration.CLASSIC_NETWORK_NUMBER]:
			'/images/currencies/classic/32.svg',
		[configuration.ZKEVM_NETWORK_NUMBER]: '/images/currencies/zkevm/16.svg',
		[configuration.POLYGON_NETWORK_NUMBER]:
			'/images/currencies/polygon/16.svg',
	},
	allowUnsupportedChain: false,
});

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const { pathname, asPath, query } = router;
	const locale = router ? router.locale : defaultLocale;
	const apolloClient = useApollo(pageProps);

	// read bypass value from local storage for skipping maintenance mode only if maintenance mode is enabled inside ENV file4
	const [isBypassingMaintenance, setIsBypassingMaintenance] =
		useState<boolean>(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const bypass = localStorage.getItem('bypassMaintenance') === 'true';
			setIsBypassingMaintenance(bypass);
		}
	}, []);

	// enable maintenance mode only if it is enabled inside ENV file and user has not bypassed it
	const isMaintenanceMode =
		process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true' &&
		!isBypassingMaintenance;

	useEffect(() => {
		const handleStart = () => {
			NProgress.start();
		};
		const handleChangeComplete = (url: string) => {
			NProgress.done();
			if (isProduction && typeof window.gtag === 'function') {
				window.gtag(
					'config',
					process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || '',
					{
						page_path: url,
					},
				);
			}

			// Track page views => Posthog
			posthog?.capture('$pageview');
		};
		const handleChangeError = () => {
			NProgress.done();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleChangeComplete);
		router.events.on('routeChangeError', handleChangeError);
		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleChangeComplete);
			router.events.off('routeChangeError', handleChangeError);
		};
	}, [router]);

	useEffect(() => {
		const asyncFunc = async () => {
			const storageLocale = localStorage.getItem(StorageLabel.LOCALE);
			const navigatorLocale = getLocaleFromNavigator();
			let ipLocale;
			if (!storageLocale) {
				ipLocale = await getLocaleFromIP();
			}
			const preferredLocale =
				storageLocale || ipLocale || navigatorLocale || defaultLocale!;

			if (
				preferredLocale !== 'undefined' &&
				typeof preferredLocale !== 'undefined' &&
				router.locale !== preferredLocale
			) {
				router.push({ pathname, query }, asPath, {
					locale: preferredLocale,
				});
			}
			if (!storageLocale || storageLocale !== preferredLocale) {
				localStorage.setItem(StorageLabel.LOCALE, preferredLocale);
			}
		};
		asyncFunc();
	}, []);

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
				<meta name='base:app_id' content='693dbd37d19763ca26ddc284' />
			</Head>
			<GoogleAnalytics
				gaId={process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || ''}
			/>
			<MiniKitProvider>
				<ReduxProvider store={store}>
					<IntlProvider
						locale={locale!}
						messages={
							IntlMessages[locale as keyof typeof IntlMessages]
						}
						defaultLocale={defaultLocale}
					>
						<ApolloProvider client={apolloClient}>
							<SolanaProvider>
								<WagmiProvider config={wagmiConfig}>
									<ThirdwebProvider>
										<QueryClientProvider
											client={queryClient}
										>
											{/* Auto-connect to Farcaster wallet when in mini app */}
											<FarcasterAutoConnect />
											<GeneralWalletProvider>
												<PostHogProvider
													client={posthog}
												>
													{isMaintenanceMode ? (
														<MaintenanceIndex />
													) : (
														<>
															<NotificationController />
															<GeneralController />
															<SubgraphController />
															<UserController />
															<HeaderWrapper />
															{isGIVeconomyRoute(
																router.route,
															) && (
																<GIVeconomyTab />
															)}
															{(pageProps as any)
																.errorStatus ? (
																<ErrorsIndex
																	statusCode={
																		(
																			pageProps as any
																		)
																			.errorStatus
																	}
																/>
															) : (
																<RenderComponent
																	Component={
																		Component
																	}
																	pageProps={
																		pageProps
																	}
																/>
															)}
															{/* {process.env.NEXT_PUBLIC_ENV !==
												'production' && (
												<Script
													id='console-script'
													strategy='afterInteractive'
													dangerouslySetInnerHTML={{
														__html: `javascript:(function () { var script = document.createElement('script'); script.src="https://cdn.jsdelivr.net/npm/eruda"; document.body.append(script); script.onload = function () { eruda.init(); } })();`,
													}}
												/>
											)} */}

															<FooterWrapper />
															<ModalController />
															<PfpController />
														</>
													)}
												</PostHogProvider>
											</GeneralWalletProvider>
										</QueryClientProvider>
									</ThirdwebProvider>
								</WagmiProvider>
							</SolanaProvider>
						</ApolloProvider>
					</IntlProvider>
				</ReduxProvider>
			</MiniKitProvider>

			<Toaster containerStyle={{ top: '80px' }} />
			<SpeedInsights />
		</>
	);
}

export default MyApp;
