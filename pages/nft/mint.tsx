import Head from 'next/head';
import { useEffect } from 'react';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import { NFTMintIndex } from '@/components/views/nft/mint/NFTMintIndex';
import { PFPMintProvider } from '@/context/pfpmint.context';

const NFTMinRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);

	return (
		<>
			<Head>
				<title>Mint PFP | Giveth</title>
			</Head>
			<PFPMintProvider>
				<NFTMintIndex />
			</PFPMintProvider>
		</>
	);
};

export default NFTMinRoute;
