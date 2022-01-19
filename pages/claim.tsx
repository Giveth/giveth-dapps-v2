import Head from 'next/head';
import ClaimView from '@/components/views/claim/Claim.view';
import { ClaimProvider } from '@/context/claim.context';
import { Toaster } from 'react-hot-toast';
import { useGeneral } from '@/context/general.context';
import { useEffect } from 'react';

export default function GIVdropRoute() {
	const { setShowHeader } = useGeneral();

	useEffect(() => {
		setShowHeader(false);
		return () => {
			setShowHeader(true);
		};
	}, [setShowHeader]);

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
