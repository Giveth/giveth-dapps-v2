import React from 'react';
import Head from 'next/head';
import AboutIndex from '@/components/views/about/AboutIndex';

const AboutRoute = () => {
	return (
		<>
			<Head>
				<title>About Us | Giveth</title>
			</Head>
			<AboutIndex />
		</>
	);
};

export default AboutRoute;
