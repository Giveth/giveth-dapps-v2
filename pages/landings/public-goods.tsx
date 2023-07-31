import { FC } from 'react';
import Head from 'next/head';
import PublicGoods from '@/components/views/landings/publicGoods';

const PublicGoodsRoute: FC = () => {
	return (
		<>
			<Head>
				<title>
					Giveth - Public Goods in Crypto and Web3 : Funding the
					Future
				</title>
			</Head>
			<PublicGoods />
		</>
	);
};

export default PublicGoodsRoute;
