import Head from 'next/head';
import HomeView from '@/components/views/Home.view';
import { ETheme, useGeneral } from '@/context/general.context';
import { useEffect } from 'react';

export default function HomeRoute() {
	const { setTheme } = useGeneral();

	useEffect(() => {
		setTheme(ETheme.Dark);
		return () => {
			setTheme(ETheme.Light);
		};
	}, [setTheme]);

	return (
		<>
			<Head>
				<title>GIVeconomy</title>
			</Head>
			<HomeView />
		</>
	);
}
