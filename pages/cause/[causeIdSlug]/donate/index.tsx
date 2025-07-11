import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next/types';
import Head from 'next/head';
import { captureException } from '@sentry/nextjs';

import { ICause, IProject } from '@/apollo/types/types';
import { FETCH_PROJECT_BY_SLUG_DONATION } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { CauseMeta } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { CauseProvider } from '@/context/donate.cause.context';
import { useAppDispatch } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import CauseDonateIndex from '@/components/views/donateCause/CauseDonateIndex';

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
		<CauseProvider project={project}>
			<Head>
				<title>{project.title} | Giveth</title>
				<CauseMeta cause={project as ICause} preTitle='Donate to' />
			</Head>
			<CauseDonateIndex />
		</CauseProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async props => {
	try {
		const { query } = props;
		const slug = decodeURI(query.causeIdSlug as string).replace(/\s/g, '');
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
