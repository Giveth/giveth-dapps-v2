import { useEffect } from 'react';
import Head from 'next/head';

import GivPowerView from '@/components/views/Power.view';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

export default function GivPower() {
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
				<title>GIVpower</title>
			</Head>
			<GivPowerView />
		</>
	);
}
