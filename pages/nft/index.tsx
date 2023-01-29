import Head from 'next/head';
import { useEffect } from 'react';
import { NFTIndex } from '@/components/views/nft/NFTIndex';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const NFTRoute = () => {
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
				<title>Edit Project | Giveth</title>
			</Head>
			<NFTIndex />
		</>
	);
};

export default NFTRoute;
