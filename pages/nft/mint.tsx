import Head from 'next/head';
import { useEffect } from 'react';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import OverviewIndex from '@/components/views/nft/overview';

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
			<OverviewIndex />
		</>
	);
};

export default NFTMinRoute;
