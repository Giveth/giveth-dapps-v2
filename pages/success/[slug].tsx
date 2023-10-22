import React, { FC } from 'react';
import Head from 'next/head';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import SuccessfulCreation from '@/components/SuccessfulCreation';
import { ProjectMeta } from '@/components/Metatag';

const SuccessRoute: FC<IProjectBySlug> = ({ project }) => {
	return (
		<>
			<Head>
				<title>{project?.title && `${project?.title} |`} Giveth</title>
				<ProjectMeta project={project} />
			</Head>
			<SuccessfulCreation project={project} />
		</>
	);
};

export async function getServerSideProps(props: { query: { slug: string } }) {
	try {
		const {
			query: { slug },
		} = props;
		const { data } = await client.query({
			query: FETCH_PROJECT_BY_SLUG,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});
		return {
			props: {
				project: data.projectBySlug,
			},
		};
	} catch (error) {
		return {
			props: {},
		};
	}
}

export default SuccessRoute;
