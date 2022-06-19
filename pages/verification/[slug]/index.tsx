import Head from 'next/head';
import { useEffect } from 'react';
import VerificationIndex from '@/components/views/verification/VerificationIndex';
import { setShowFooter } from '@/features/general/general.sclie';
import { VerificationProvider } from '@/context/verification.context';
import { useAppDispatch } from '@/features/hooks';

const VerificationRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
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
