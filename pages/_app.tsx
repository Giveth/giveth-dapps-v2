import React, { useEffect } from 'react';
import Head from 'next/head';
import { IntlProvider } from 'react-intl';
import { Toaster } from 'react-hot-toast';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import NProgress from 'nprogress';
import * as snippet from '@segment/snippet';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import Script from 'next/script';

import { useApollo } from '@/apollo/apolloClient';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';

import '../styles/globals.css';
import { ca, en, es } from '../lang';
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
import { isGIVeconomyRoute } from '@/lib/helpers';
import GIVeconomyTab from '@/components/GIVeconomyTab';
import MaintenanceIndex from '@/components/views/Errors/MaintenanceIndex';
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

function getLibrary(provider: ExternalProvider) {
	return new Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const locale = router ? router.locale : 'en';
	const apolloClient = useApollo(pageProps);
	const isMaintenanceMode = process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true';

	useEffect(() => {
		const handleStart = (url: string) => {
			console.log(`Loading: ${url}`);
			NProgress.start();
		};
		const handleChangeComplete = (url: string) => {
			NProgress.done();
			process.env.NEXT_PUBLIC_ENV === 'production' &&
				window.analytics.page(url);
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
		localStorage.setItem(StorageLabel.LOCALE, locale || 'en');
	}, [locale]);

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
			</Head>
			<Provider store={store}>
				<IntlProvider
					locale={locale!}
					messages={IntlMessages[locale as keyof typeof IntlMessages]}
					defaultLocale='en'
				>
					<ApolloProvider client={apolloClient}>
						<Web3ReactProvider getLibrary={getLibrary}>
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
												(pageProps as any).errorStatus
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

									<FooterWrapper />
									<ModalController />
									<PfpController />
								</>
							)}
						</Web3ReactProvider>
					</ApolloProvider>
				</IntlProvider>
			</Provider>

			<Toaster containerStyle={{ top: '80px' }} />
		</>
	);
}

export default MyApp;
