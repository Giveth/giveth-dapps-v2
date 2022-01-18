import React from 'react';
import Head from 'next/head';
import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { FETCH_HOME_PROJECTS } from '@/apollo/gql/gqlProjects';
import { gqlEnums } from '@/apollo/types/gqlEnums';
import { IProject } from '@/apollo/types/types';

const projectsToFetch = 15;

interface IHomeRoute {
	projects: IProject[];
	totalCount: number;
}

const HomeRoute = (props: IHomeRoute) => {
	return (
		<>
			<Head>
				<title>Home | Giveth</title>
			</Head>
			<HomeIndex {...props} />
		</>
	);
};

export async function getServerSideProps() {
	const { data } = await client.query({
		query: FETCH_HOME_PROJECTS,
		variables: {
			limit: projectsToFetch,
			orderBy: { field: gqlEnums.QUALITYSCORE, direction: gqlEnums.DESC },
		},
	});

	const { projects, totalCount } = data.projects;

	return {
		props: {
			projects,
			totalCount,
		},
	};
}

export default HomeRoute;
