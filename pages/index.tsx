import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next/types';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import {
	IProject,
	IProjectUpdateWithProject,
	IRecentDonation,
} from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { HOMEPAGE_DATA } from '@/apollo/gql/gqlHomePage';

export interface IHomeRoute {
	projects: IProject[];
	totalCount: number;
	recentDonations: IRecentDonation[];
	projectsPerDate: { total: number };
	totalDonorsCountPerDate: { total: number };
	donationsTotalUsdPerDate: { total: number };
	latestUpdates: IProjectUpdateWithProject[];
}

const fetchProjects = async (userId: string | undefined = undefined) => {
	const variables: any = {
		limit: 12,
		sortingBy: ESortbyAllProjects.GIVPOWER,
	};

	if (userId) {
		variables.connectedWalletUserId = Number(userId);
	}
	const { data } = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables,
		fetchPolicy: 'network-only',
	});

	return data.allProjects;
};

const dateFormat = (d: Date) => {
	// return date with hour precision for caching efficiency
	const ISODate = d.toISOString();
	const date = ISODate.split('T')[0];
	const hour = d.getHours();
	return `${date}T${hour}:00:00.000Z`;
};

const HomeRoute = (props: IHomeRoute) => {
	const { projects: _projects, totalCount: _totalCount, ...rest } = props;
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(props.projects);
	const [totalCount, setTotalCount] = useState(props.totalCount);

	useEffect(() => {
		if (!user) return;
		fetchProjects(user?.id).then(({ projects, totalCount }) => {
			setProjects(projects);
			setTotalCount(totalCount);
		});
	}, [user]);

	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex projects={projects} totalCount={totalCount} {...rest} />
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
				toDate: dateFormat(new Date()),
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
			},
			revalidate: 600,
		};
	} catch (error: any) {
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
