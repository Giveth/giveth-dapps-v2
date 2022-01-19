import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ThemeProvider } from '@/context/theme.context';
import { FarmProvider } from '@/context/farm.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';
import { ApolloProvider } from '@apollo/client';

import { MobileModal } from '@/components/modals/Mobile';
import { useEffect, useState } from 'react';
import { SubgraphProvider } from '@/context/subgraph.context';
import Head from 'next/head';
import { PriceProvider } from '@/context/price.context';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { GeneralProvider } from '@/context/general.context';
import { useApollo } from '@/apollo/apolloClient';
import { UserProvider } from '@/context/UserProvider';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';

function getLibrary(provider: ExternalProvider) {
	return new Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
	const [showMobileModal, setShowMobileModal] = useState(false);
	const [viewPort, setViewPort] = useState(false);
	const apolloClient = useApollo(pageProps);

	useEffect(() => {
		const windowResizeHandler = () => {
			if (window.screen.width < 768) {
				setShowMobileModal(true);
				setViewPort(true);
			} else {
				setShowMobileModal(false);
				setViewPort(false);
			}
		};
		windowResizeHandler();
		window.addEventListener('resize', windowResizeHandler);
		return () => {
			removeEventListener('resize', windowResizeHandler);
		};
	}, []);

	return (
		<>
			<Head>
				{viewPort && <meta name='viewport' content='width=768' />}
			</Head>
			<GeneralProvider>
				<ApolloProvider client={apolloClient}>
					<Web3ReactProvider getLibrary={getLibrary}>
						<SubgraphProvider>
							<TokenDistroProvider>
								<NftsProvider>
									<PriceProvider>
										<FarmProvider>
											<UserProvider>
												<HeaderWrapper />
												<Component {...pageProps} />
												<FooterWrapper />
												{showMobileModal && (
													<MobileModal
														showModal={
															showMobileModal
														}
														setShowModal={
															setShowMobileModal
														}
													/>
												)}
											</UserProvider>
										</FarmProvider>
									</PriceProvider>
								</NftsProvider>
							</TokenDistroProvider>
						</SubgraphProvider>
					</Web3ReactProvider>
				</ApolloProvider>
			</GeneralProvider>
		</>
	);
}
export default MyApp;
