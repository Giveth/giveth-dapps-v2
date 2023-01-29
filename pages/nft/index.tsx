import Head from 'next/head';
import { NFTIndex } from '@/components/views/nft/NFTIndex';

const NFTRoute = () => {
	return (
		<>
			<Head>
				<title>Edit Project | Giveth</title>
			</Head>
			<NFTIndex />
		</>
	);
};

export default NFTRoute;
