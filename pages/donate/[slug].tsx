import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { captureException } from '@sentry/nextjs';

import { IProjectBySlug } from '@/apollo/types/types';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ProjectMeta } from '@/components/Metatag';
import DonateIndex from '@/components/views/donate/DonateIndex';

const NotAvailableProject = dynamic(
	() => import('@/components/NotAvailableProject'),
	{
		ssr: false,
	},
);

const DonateRoute = (props: IProjectBySlug) => {
	const { project } = props;
	if (!project) return <NotAvailableProject />;

	return (
		<>
			<Head>
				<title>{project.title} | Giveth</title>
				<ProjectMeta project={project} preTitle='Donate to' />
			</Head>
			<DonateIndex {...props} />
		</>
	);
};

export async function getServerSideProps(props: { query: { slug: string } }) {
	try {
		const { query } = props;
		const slug = decodeURI(query.slug).replace(/\s/g, '');
		const { data } = await client.query({
			query: FETCH_PROJECT_BY_SLUG,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});
		const project = data.projectBySlug;
		return {
			props: {
				project,
			},
		};
	} catch (error: any) {
		captureException(error, {
			tags: {
				section: 'Donate SSR',
			},
		});
		if (error.message === 'Project not found.') {
			return {
				props: {},
			};
		}
		throw new Error('Error on FETCH_PROJECT_BY_SLUG');
	}
}

export default DonateRoute;
