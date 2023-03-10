import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FC } from 'react';
import EthDenverView from '@/components/views/landings/EthDenver';
import { FETCH_CAMPAIGN_BY_SLUG } from '@/apollo/gql/gqlCampaign';
import { client } from '@/apollo/apolloClient';
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

export const getStaticProps: GetStaticProps = async context => {
	try {
		const { data } = await client.query({
			query: FETCH_CAMPAIGN_BY_SLUG,
			variables: {
				slug: 'ethDenver',
			},
			fetchPolicy: 'no-cache',
		});
		return {
			props: {
				campaign: data.findCampaignBySlug,
			},
			revalidate: 600,
		};
	} catch (error) {
		return {
			props: {},
			revalidate: 1,
		};
	}
};

export default EthDenverRoute;
