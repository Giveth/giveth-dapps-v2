import React, { FC } from 'react';
import { GetServerSideProps } from 'next/types';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import { captureException } from '@sentry/nextjs';
import dynamic from 'next/dynamic';

import { IDonationProject } from '@/apollo/types/types';
import {
	FETCH_GIVETH_PROJECT_BY_ID,
	FETCH_PROJECT_BY_SLUG,
} from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ProjectMeta } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import config from '@/configuration';
import { DonateProvider } from '@/context/donate.context';

export interface IDonateRouteProps {
	project: IDonationProject;
}

const DonateIndex = dynamic(
	() => import('@/components/views/donate/DonateIndex'),
	{ ssr: false },
);

const DonateRoute: FC<IDonateRouteProps> = ({ project }) => {
	return (
		<DonateProvider project={project}>
			<Head>
				<title>{project.title} | Giveth</title>
				<ProjectMeta project={project} preTitle='Donate to' />
			</Head>
			<DonateIndex />
		</DonateProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async props => {
	try {
		const { query } = props;
		const slug = decodeURI(query.slug as string).replace(/\s/g, '');
		const { data } = await client.query({
			query: FETCH_PROJECT_BY_SLUG,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});
		const { data: givethProjectData } = await client.query({
			query: FETCH_GIVETH_PROJECT_BY_ID,
			variables: { id: config.GIVETH_PROJECT_ID },
			fetchPolicy: 'no-cache',
		});

		const project = {
			...data.projectBySlug,
			givethAddresses: givethProjectData.projectById.addresses,
		};
		return {
			props: {
				project,
			},
		};
	} catch (error: any) {
		console.log({ error });
		captureException(error, {
			tags: {
				section: 'Donate SSR',
			},
		});
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

export default DonateRoute;
