import Head from 'next/head';
import { useEffect } from 'react';
import VerificationIndex from '@/components/views/verification/VerificationIndex';
import { useGeneral } from '@/context/general.context';

const VerificationRoute = () => {
	const { setShowFooter } = useGeneral();

	useEffect(() => {
		setShowFooter(false);
	}, []);

	return (
		<>
			<Head>
				<title>Verify a Project | Giveth</title>
			</Head>
			<VerificationIndex />
		</>
	);
};

export default VerificationRoute;
