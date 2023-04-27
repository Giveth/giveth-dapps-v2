import { FC } from 'react';
import Head from 'next/head';
import Web3CryptoDonation from '@/components/views/landings/web3CryptoDonation';

const Web3CryptoDonationRoute: FC = () => {
	return (
		<>
			<Head>
				<title>Giveth - Web3 Crypto Donation Platform</title>
			</Head>
			<Web3CryptoDonation />
		</>
	);
};

export default Web3CryptoDonationRoute;
