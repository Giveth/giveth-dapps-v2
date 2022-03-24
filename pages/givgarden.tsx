import Head from 'next/head';
import { useEffect } from 'react';

import GIVgardenView from '@/components/views/Garden.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { GiveconomyMeta } from '@/lib/meta';

export default function GIVgardenRoute() {
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
				<title>GIVgarden</title>
				<GiveconomyMeta />
			</Head>
			<GIVgardenView />
		</>
	);
}
