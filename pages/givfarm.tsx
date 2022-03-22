import Head from 'next/head';
import { useEffect } from 'react';

import GIVfarmView from '@/components/views/Farm.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { GiveconomyMeta } from '@/lib/meta';

export default function GIVfarmRoute() {
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
				<title>GIVfarm</title>
				<GiveconomyMeta />
			</Head>
			<GIVfarmView />
		</>
	);
}
