import Head from 'next/head';
import ClaimView from '@/components/views/claim/Claim.view';
import { ClaimProvider } from '@/context/claim.context';
import { Toaster } from 'react-hot-toast';
import { ETheme, useGeneral } from '@/context/general.context';
import { useEffect } from 'react';

export default function GIVdropRoute() {
	const { setShowHeader, setTheme } = useGeneral();

	useEffect(() => {
		setShowHeader(false);
		setTheme(ETheme.Dark);
		return () => {
			setShowHeader(true);
			setTheme(ETheme.Light);
		};
	}, [setShowHeader, setTheme]);

	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<ClaimProvider>
				<ClaimView />
			</ClaimProvider>
			<Toaster />
		</>
	);
}
