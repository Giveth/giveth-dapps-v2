import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FC } from 'react';
import EthDenverView from '@/components/views/landings/EthDenver';
import { ICampaign } from '@/apollo/types/types';

export interface IEthDenverProps {
	campaign?: ICampaign;
}

const EthDenverRoute: FC<IEthDenverProps> = ({ campaign }) => {
	return (
		<>
			<Head>
				<title>ETHDenver</title>
			</Head>
			<EthDenverView campaign={campaign} />
		</>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	try {
		//The campaign in not active
		// const { data } = await client.query({
		// 	query: FETCH_CAMPAIGN_BY_SLUG,
		// 	variables: {
		// 		slug: 'ethDenver',
		// 	},
		// 	fetchPolicy: 'no-cache',
		// });
		// return {
		// 	props: {
		// 		campaign: data.findCampaignBySlug,
		// 	},
		// 	revalidate: 600,
		// };
		return {
			props: {},
		};
	} catch (error) {
		return {
			props: {},
			revalidate: 1,
		};
	}
};

export default EthDenverRoute;
