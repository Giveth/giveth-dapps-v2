import React, { useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import Script from 'next/script';
import * as gtag from '@/lib/gtag';
import { useApollo } from '@/apollo/apolloClient';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';

import '../styles/globals.css';
import { store } from '@/features/store';
import SubgraphController from '@/components/controller/subgraph.ctrl';
import UserController from '@/components/controller/user.ctrl';
import ModalController from '@/components/controller/modal.ctrl';
import PriceController from '@/components/controller/price.ctrl';
import GeneralController from '@/components/controller/general.ctrl';
import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { isProduction } from '@/configuration';
import type { AppProps } from 'next/app';

function getLibrary(provider: ExternalProvider) {
	return new Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const apolloClient = useApollo(pageProps);

	useEffect(() => {
		const handleStart = (url: string) => {
			console.log(`Loading: ${url}`);
			NProgress.start();
		};
		const handleStop = () => {
			NProgress.done();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleStop);
		router.events.on('routeChangeError', handleStop);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleStop);
			router.events.off('routeChangeError', handleStop);
		};
	}, [router]);

        // when route changed call GA.
	useEffect(() => {
		if (isProduction) {
			//google analytics on route change
			const handleRouteChange = (url: URL) => {
				gtag.pageview(url);
			};
			router.events.on('routeChangeComplete', handleRouteChange);
			router.events.on('hashChangeComplete', handleRouteChange);
			return () => {
				router.events.off('routeChangeComplete', handleRouteChange);
				router.events.off('hashChangeComplete', handleRouteChange);
			};
		}
	}, [router.events]);

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
			</Head>
			<Provider store={store}>
				<ApolloProvider client={apolloClient}>
					<Web3ReactProvider getLibrary={getLibrary}>
						<GeneralController />
						<PriceController />
						<SubgraphController />
						<UserController />
						<HeaderWrapper />
						{pageProps.errorStatus ? (
							<ErrorsIndex statusCode={pageProps.errorStatus} />
						) : (
							<Component {...pageProps} />
						)}

						<FooterWrapper />
						<ModalController />
					</Web3ReactProvider>
				</ApolloProvider>
			</Provider>
			<Toaster containerStyle={{ top: '80px' }} />
			{isProduction && (
				<>
					<Script
						strategy='afterInteractive'
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
					/>
					<Script
						id='gtag-init'
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
				  window.dataLayer = window.dataLayer || [];
				  function gtag(){dataLayer.push(arguments);}
				  gtag('js', new Date());
				  gtag('config', '${GA_TRACKING_ID}', {
					page_path: window.location.pathname,
				  });
			  `,
						}}
					/>
				</>
			)}
		</>
	);
}

export default MyApp;
