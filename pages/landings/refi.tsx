import { FC } from 'react';
import Head from 'next/head';
import ReFiLandingPage from '@/components/views/landings/refi';

const ReFiRoute: FC = () => {
	return (
		<>
			<Head>
				<title>Giveth - ReFi: Regenerative Finance</title>
			</Head>
			<ReFiLandingPage />
		</>
	);
};

export default ReFiRoute;
