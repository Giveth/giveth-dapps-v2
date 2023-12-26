import React, { useEffect } from 'react';
import Head from 'next/head';
import { IntlProvider } from 'react-intl';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import * as snippet from '@segment/snippet';
import { useRouter } from 'next/router';
import { Provider as ReduxProvider } from 'react-redux';
import Script from 'next/script';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { EIP6963Connector, createWeb3Modal } from '@web3modal/wagmi/react';
import { walletConnectProvider } from '@web3modal/wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';
import { useApollo } from '@/apollo/apolloClient';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';
import '../styles/globals.css';
import { ca, en, es } from '../lang';
import config from '@/configuration';
import { store } from '@/features/store';
import SubgraphController from '@/components/controller/subgraph.ctrl';
import UserController from '@/components/controller/user.ctrl';
import ModalController from '@/components/controller/modal.ctrl';
import PriceController from '@/components/controller/price.ctrl';
import GeneralController from '@/components/controller/general.ctrl';
import NotificationController from '@/components/controller/pfp.ctrl';
import PfpController from '@/components/controller/notification.ctrl';
import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';
import StorageLabel from '@/lib/localStorage';
import {
	getLocaleFromIP,
	getLocaleFromNavigator,
	isGIVeconomyRoute,
} from '@/lib/helpers';
import GIVeconomyTab from '@/components/GIVeconomyTab';
import MaintenanceIndex from '@/components/views/Errors/MaintenanceIndex';
import { SolanaProvider } from '@/solana/solanaWalletProvider';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

declare global {
	interface Window {
		analytics: any;
	}
}

const DEFAULT_WRITE_KEY = 'MHK95b7o6FRNHt0ZZJU9bNGUT5MNCEyB';

export const IntlMessages = {
	ca,
	en,
	es,
};

const defaultLocale = process.env.defaultLocale;

function renderSnippet() {
	const opts = {
		apiKey:
			process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,
		// note: the page option only covers SSR tracking.
		// Page.js is used to track other events using `window.analytics.page()`
		page: true,
	};

	if (process.env.NEXT_PUBLIC_ENV === 'development') {
		return snippet.max(opts);
	}

	return snippet.min(opts);
}

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!;

const metadata = {
	name: 'Giveth',
	description:
		'Get rewarded for giving to for-good projects with zero added fees. Donate crypto directly to thousands of for-good projects, nonprofits &amp; charities!',
	url: 'https://giveth.io',
	icons: ['https://giveth.io/images/currencies/giv/24.svg'],
};

const chains = config.CHAINS;
const { publicClient } = configureChains(chains, [
	walletConnectProvider({ projectId }),
	publicProvider(),
]);
const wagmiConfig = createConfig({
	autoConnect: false,
	connectors: [
		new WalletConnectConnector({
			chains,
			options: { projectId, showQrModal: false, metadata },
		}),
		new EIP6963Connector({ chains }),
		new InjectedConnector({ chains, options: { shimDisconnect: true } }),
	],
	publicClient,
});

const classicNetworkNumber = config.CLASSIC_NETWORK_NUMBER;

createWeb3Modal({
	wagmiConfig,
	projectId,
	chains,
	featuredWalletIds: [
		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
	],
	includeWalletIds: [
		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
	],
	chainImages: {
		[classicNetworkNumber]: '/images/currencies/classic/32.svg',
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const { pathname, asPath, query } = router;
	const locale = router ? router.locale : defaultLocale;
	const apolloClient = useApollo(pageProps);
	const isMaintenanceMode = process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true';

	useEffect(() => {
		const handleStart = (url: string) => {
			console.log(`Loading: ${url}`);
			NProgress.start();
		};
		const handleChangeComplete = (url: string) => {
			NProgress.done();
			isProduction && window.analytics.page(url);
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
			if (router.locale !== preferredLocale) {
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
			</Head>
			<ReduxProvider store={store}>
				<IntlProvider
					locale={locale!}
					messages={IntlMessages[locale as keyof typeof IntlMessages]}
					defaultLocale={defaultLocale}
				>
					<ApolloProvider client={apolloClient}>
						<SolanaProvider>
							<WagmiConfig config={wagmiConfig}>
								{isMaintenanceMode ? (
									<MaintenanceIndex />
								) : (
									<>
										<NotificationController />
										<GeneralController />
										<PriceController />
										<SubgraphController />
										<UserController />
										<HeaderWrapper />
										{isGIVeconomyRoute(router.route) && (
											<GIVeconomyTab />
										)}
										{(pageProps as any).errorStatus ? (
											<ErrorsIndex
												statusCode={
													(pageProps as any)
														.errorStatus
												}
											/>
										) : (
											<Component {...pageProps} />
										)}
										{process.env.NEXT_PUBLIC_ENV ===
											'production' && (
											<Script
												id='segment-script'
												strategy='afterInteractive'
												dangerouslySetInnerHTML={{
													__html: renderSnippet(),
												}}
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
							</WagmiConfig>
						</SolanaProvider>
					</ApolloProvider>
				</IntlProvider>
			</ReduxProvider>

			<Toaster containerStyle={{ top: '80px' }} />
		</>
	);
}

export default MyApp;
