import { FC } from 'react';
import Head from 'next/head';
import { IEthDenverProps } from './ethdenver';
import Taketh from '@/components/views/landings/taketh';

const TakethRoute: FC<IEthDenverProps> = () => {
	return (
		<>
			<Head>
				<title>Taketh</title>
			</Head>
			<Taketh />
		</>
	);
};

export default TakethRoute;
