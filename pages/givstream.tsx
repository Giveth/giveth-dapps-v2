import GIVstreamView from '@/components/views/Stream.view';
import { useGeneral, ETheme } from '@/context/general.context';
import Head from 'next/head';
import { useEffect } from 'react';

export default function GIVstreamRoute() {
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
				<title>GIVstream</title>
			</Head>
			<GIVstreamView />
		</>
	);
}
