import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';

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

function getLibrary(provider: ExternalProvider) {
	return new Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
	const apolloClient = useApollo(pageProps);

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
