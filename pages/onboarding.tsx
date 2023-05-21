import { FC } from 'react';
import Head from 'next/head';
import GetStarted from '@/components/views/landings/getStarted';

const GetStartedRoute: FC = () => {
	return (
		<>
			<Head>
				<title>Giveth - Get started with Giveth</title>
			</Head>
			<GetStarted />
		</>
	);
};

export default GetStartedRoute;
