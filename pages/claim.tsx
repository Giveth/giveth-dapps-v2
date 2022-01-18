import Head from 'next/head';
import ClaimView from '@/components/views/claim/Claim.view';
import { UserProvider } from '@/context/user.context';
import { Toaster } from 'react-hot-toast';

export default function GIVdropRoute() {
	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<UserProvider>
				<ClaimView />
			</UserProvider>
			<Toaster />
		</>
	);
}
