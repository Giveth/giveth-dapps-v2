import { FC } from 'react';
import Head from 'next/head';
import GIVBacksIndex from '@/components/views/landings/GIVBacks';

const GIVBacksRoute: FC = () => {
	return (
		<>
			<Head>
				<title>Giveth | GIVBacks</title>
			</Head>
			<GIVBacksIndex />
		</>
	);
};

export default GIVBacksRoute;
