import Head from 'next/head';
import { PassportView } from '@/components/views/passport/passport.view';

const PassportRoute = () => {
	return (
		<>
			<Head>
				<title>Passport Score | Giveth</title>
			</Head>
			<PassportView />
		</>
	);
};

export default PassportRoute;
