import React from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';

import { FarmProvider } from '@/context/farm.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';
import { SubgraphProvider } from '@/context/subgraph.context';
import { PriceProvider } from '@/context/price.context';
import { GeneralProvider } from '@/context/general.context';
import { useApollo } from '@/apollo/apolloClient';
import { UserProvider } from '@/context/UserProvider';
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
			<GeneralProvider>
				<ApolloProvider client={apolloClient}>
					<Web3ReactProvider getLibrary={getLibrary}>
						<SubgraphProvider>
							<TokenDistroProvider>
								<NftsProvider>
									<PriceProvider>
										<FarmProvider>
											<CookiesProvider>
												<UserProvider>
													<HeaderWrapper />
													<Component {...pageProps} />
													<FooterWrapper />
												</UserProvider>
											</CookiesProvider>
										</FarmProvider>
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
