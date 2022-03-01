import Head from 'next/head';
import React from 'react';
import CreateView from '@/components/views/create/CreateIndex';

const CreateRoute = () => {
	return (
		<>
			<Head>
				<title>Create a Project | Giveth</title>
			</Head>
			<CreateView />
		</>
	);
};

export default CreateRoute;
