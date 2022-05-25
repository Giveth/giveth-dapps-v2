import Head from 'next/head';
import { useEffect } from 'react';

import GIVbackView from '@/components/views/Back.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { givbacksMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

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
				<GeneralMetatags info={givbacksMetatags} />
			</Head>
			<GIVbackView />
		</>
	);
}
