import Head from 'next/head';
import TermsIndex from '@/components/views/TermsIndex';

const TermsRoute = () => {
	return (
		<>
			<Head>
				<title>Terms of Use | Giveth</title>
			</Head>
			<TermsIndex />
		</>
	);
};

export default TermsRoute;
