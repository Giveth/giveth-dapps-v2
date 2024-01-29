import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import SuccessfulCreation from '@/components/SuccessfulCreation';
import { ProjectMeta } from '@/components/Metatag';
import { IProject } from '@/apollo/types/types';

const SuccessRoute = () => {
	const [project, setProject] = useState<IProject>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();
	const slug = router.query.slug;

	useEffect(() => {
		const asyncFunc = async () => {
			setIsLoading(true);
			try {
				const { data } = await client.query({
					query: FETCH_PROJECT_BY_SLUG,
					variables: { slug },
					fetchPolicy: 'no-cache',
				});
				console.log('Data', data);
				setProject(data.projectBySlug);
				setIsLoading(false);
			} catch (error) {
				console.log('fetchProjectBySlug error: ', error);
				setIsLoading(false);
				captureException(error, {
					tags: {
						section: 'SuccessRoute/asyncFunc',
					},
				});
			}
		};
		if (slug) asyncFunc();
	}, [slug]);

	return (
		<>
			<Head>
				<title>{project?.title && `${project?.title} |`} Giveth</title>
				<ProjectMeta project={project} />
			</Head>
			<SuccessfulCreation isLoading={isLoading} project={project} />
		</>
	);
};

export default SuccessRoute;
