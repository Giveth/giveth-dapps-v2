import React from 'react';
import Head from 'next/head';
import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';

const ProjectsRoute = () => {
	return (
		<>
			<Head>
				<title>Projects | Giveth</title>
			</Head>
			<ProjectsIndex />
		</>
	);
};

export async function getServerSideProps() {
	const apolloClient = initializeApollo();

	await apolloClient.query({
		query: FETCH_ALL_PROJECTS,
		...OPTIONS_HOME_PROJECTS,
	});

	return addApolloState(apolloClient, {
		props: {},
	});
}

export default ProjectsRoute;
