import React from 'react';
import Head from 'next/head';

import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { IProjectBySlug } from '@/apollo/types/types';
import DonateIndex from '@/components/views/donate/DonateIndex';
import { ProjectMeta } from '@/lib/meta';

const DonateRoute = (props: IProjectBySlug) => {
	return (
		<>
			<Head>
				<title>{props.project.title} | Giveth</title>
				<ProjectMeta project={props.project} preTitle='Donate to' />
			</Head>
			<DonateIndex {...props} />
		</>
	);
};

export async function getServerSideProps(props: { query: { slug: string } }) {
	const { query } = props;
	const slug = decodeURI(query.slug).replace(/\s/g, '');
	try {
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
	} catch (error) {
		console.log({ error });
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
}

export default DonateRoute;
