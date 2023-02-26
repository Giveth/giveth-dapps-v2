import Head from 'next/head';
import EthDenverView from '@/components/views/landings/EthDenver';

const EthDenverRoute = () => {
	return (
		<>
			<Head>
				<title>ETHDenver</title>
			</Head>
			<EthDenverView />
		</>
	);
};

export default EthDenverRoute;
