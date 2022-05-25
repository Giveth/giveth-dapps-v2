import { useEffect } from 'react';
import Head from 'next/head';

import { ETheme, useGeneral } from '@/context/general.context';
import GivPowerView from '@/components/views/Power.view';

export default function GivPower() {
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
				<title>GIVpower</title>
			</Head>
			<GivPowerView />
		</>
	);
}
