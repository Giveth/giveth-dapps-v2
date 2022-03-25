import GIVbackView from '@/components/views/Back.view';
import { useGeneral, ETheme } from '@/context/general.context';
import Head from 'next/head';
import { useEffect } from 'react';

export default function GIVbacksRoute() {
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
				<title>GIVbacks</title>
			</Head>
			<GIVbackView />
		</>
	);
}
