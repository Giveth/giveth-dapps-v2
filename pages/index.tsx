import { GetStaticProps } from 'next/types';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { ICampaign, IProjectUpdateWithProject } from '@/apollo/types/types';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { FETCH_HOMEPAGE_DATA_REDUCED } from '@/apollo/gql/gqlHomePage';

export interface IHomeRoute {
	projectsPerDate: { total: number };
	totalDonorsCountPerDate: { total: number };
	donationsTotalUsdPerDate: { total: number };
	latestUpdates: IProjectUpdateWithProject[];
	campaigns: ICampaign[];
}

export const HOME_QUERY_VARIABLES = {
	take: 50,
	takeLatestUpdates: 10,
	skipLatestUpdates: 0,
	fromDate: '2021-01-01',
	toDate: new Date().toISOString().split('T')[0], // Today's date
	connectedWalletUserId: null,
};

const HomeRoute = (props: IHomeRoute) => {
	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex {...props} />
		</>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await client.query({
		query: FETCH_HOMEPAGE_DATA_REDUCED,
		variables: HOME_QUERY_VARIABLES,
		fetchPolicy: 'no-cache',
		context: {
			skipAuth: true,
		},
	});
	return {
		props: {
			projectsPerDate: data.projectsPerDate,
			totalDonorsCountPerDate: data.totalDonorsCountPerDate,
			donationsTotalUsdPerDate: data.donationsTotalUsdPerDate,
			latestUpdates: data.projectUpdates.projectUpdates,
			campaigns: data.campaigns,
		},
		revalidate: 600,
	};
};

export default HomeRoute;
