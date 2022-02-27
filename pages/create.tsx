import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import CreateView from '@/components/views/create/CreateIndex';

const CreateRoute = () => {
	return (
		<>
			<Head>
				<title>Create a Project | Giveth</title>
			</Head>
			<CreateView />
			<Toaster containerStyle={{ top: '80px' }} />
		</>
	);
};

export default CreateRoute;
