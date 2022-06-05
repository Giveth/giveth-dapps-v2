import Head from 'next/head';
import { useEffect } from 'react';
import VerificationIndex from '@/components/views/verification/VerificationIndex';
import { useGeneral } from '@/context/general.context';
import { VerificationProvider } from '@/context/verification.context';

const VerificationRoute = () => {
	const { setShowFooter } = useGeneral();

	useEffect(() => {
		setShowFooter(false);
	}, []);

	return (
		<VerificationProvider>
			<Head>
				<title>Verify a Project | Giveth</title>
			</Head>
			<VerificationIndex />
		</VerificationProvider>
	);
};

export default VerificationRoute;
