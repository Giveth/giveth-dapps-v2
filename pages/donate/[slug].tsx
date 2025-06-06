import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next/types';
import Head from 'next/head';
import { captureException } from '@sentry/nextjs';

import { IProject } from '@/apollo/types/types';
import { FETCH_PROJECT_BY_SLUG_DONATION } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ProjectMeta } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { DonateProvider } from '@/context/donate.context';
import DonateIndex from '@/components/views/donate/DonateIndex';
import { useAppDispatch } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';

export interface IDonateRouteProps {
	project: IProject;
}

const DonateRoute: FC<IDonateRouteProps> = ({ project }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

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
			query: FETCH_PROJECT_BY_SLUG_DONATION,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});
		return {
			props: {
				project: data.projectBySlug,
			},
		};
	} catch (error: any) {
		console.error({ error });
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
