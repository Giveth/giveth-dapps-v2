import React, { useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import NProgress from 'nprogress';

import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';
import { SubgraphProvider } from '@/context/subgraph.context';
import { PriceProvider } from '@/context/price.context';
import { GeneralProvider } from '@/context/general.context';
import { useApollo } from '@/apollo/apolloClient';
import { UserProvider } from '@/context/UserProvider';
import { ModalProvider } from '@/context/ModalProvider';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';

import '../styles/globals.css';
import { useRouter } from 'next/router';

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

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
			</Head>
			<GeneralProvider>
				<ApolloProvider client={apolloClient}>
					<Web3ReactProvider getLibrary={getLibrary}>
						<SubgraphProvider>
							<TokenDistroProvider>
								<NftsProvider>
									<PriceProvider>
										<UserProvider>
											<ModalProvider>
												<HeaderWrapper />
												<Component {...pageProps} />
												<FooterWrapper />
											</ModalProvider>
										</UserProvider>
									</PriceProvider>
								</NftsProvider>
							</TokenDistroProvider>
						</SubgraphProvider>
					</Web3ReactProvider>
				</ApolloProvider>
			</GeneralProvider>
			<Toaster containerStyle={{ top: '80px' }} />
		</>
	);
}

export default MyApp;
