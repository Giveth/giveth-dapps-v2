import Head from 'next/head';
import EditIndex from '@/components/views/EditIndex';

const editRoute = () => {
	return (
		<>
			<Head>
				<title>Edit Project | Giveth</title>
			</Head>
			<EditIndex />
		</>
	);
};

export default editRoute;
