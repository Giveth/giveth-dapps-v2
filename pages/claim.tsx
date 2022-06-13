import Head from 'next/head';
import { useEffect } from 'react';

import ClaimView from '@/components/views/claim/Claim.view';
import { ClaimProvider } from '@/context/claim.context';
import { useAppDispatch } from '@/features/hooks';
import {
	setDarkTheme,
	setLightTheme,
	setShowHeader,
} from '@/features/general/general.sclie';

export default function GIVdropRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowHeader(false));
		dispatch(setDarkTheme());
		return () => {
			dispatch(setShowHeader(true));
			dispatch(setLightTheme());
		};
	}, [dispatch]);

	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<ClaimProvider>
				<ClaimView />
			</ClaimProvider>
		</>
	);
}
