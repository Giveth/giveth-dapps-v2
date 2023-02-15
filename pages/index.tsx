import { GetStaticProps } from 'next/types';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import {
	ICampaign,
	IProjectUpdateWithProject,
	IRecentDonation,
} from '@/apollo/types/types';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { HOMEPAGE_DATA } from '@/apollo/gql/gqlHomePage';

export interface IHomeRoute {
	recentDonations: IRecentDonation[];
	projectsPerDate: { total: number };
	totalDonorsCountPerDate: { total: number };
	donationsTotalUsdPerDate: { total: number };
	latestUpdates: IProjectUpdateWithProject[];
	campaigns: ICampaign[];
}

const HomeRoute = (props: IHomeRoute) => {
	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex {...props} />
		</>
	);
};

export const getStaticProps: GetStaticProps = async context => {
	try {
		const { data } = await client.query({
			query: HOMEPAGE_DATA,
			variables: {
				take: 50,
				takeLatestUpdates: 50,
				skipLatestUpdates: 0,
				fromDate: '2021-01-01',
				limit: 12,
				sortingBy: ESortbyAllProjects.GIVPOWER,
			},
			fetchPolicy: 'no-cache',
		});
		return {
			props: {
				projects: data.allProjects.projects,
				totalCount: data.allProjects.totalCount,
				recentDonations: data.recentDonations,
				projectsPerDate: data.projectsPerDate,
				totalDonorsCountPerDate: data.totalDonorsCountPerDate,
				donationsTotalUsdPerDate: data.donationsTotalUsdPerDate,
				latestUpdates: data.projectUpdates.projectUpdates,
				campaigns: data.campaigns,
			},
			revalidate: 600,
		};
	} catch (error: any) {
		console.log('error', error);
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}
};

export default HomeRoute;
