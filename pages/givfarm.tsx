import Head from 'next/head';
import { useEffect } from 'react';

import GIVfarmView from '@/components/views/Farm.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { givfarmMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

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
				<title>{givfarmMetatags.title}</title>
				<GeneralMetatags info={givfarmMetatags} />
			</Head>
			<GIVfarmView />
		</>
	);
}
