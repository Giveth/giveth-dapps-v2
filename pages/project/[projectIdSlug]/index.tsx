import { FC } from 'react';
import Head from 'next/head';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT } from '@/apollo/gql/gqlProjects';

import { useReferral } from '@/hooks/useReferral';
import ProjectIndex from '@/components/views/project/ProjectIndex';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';
import { ProjectMeta } from '@/components/Metatag';
import { EProjectType } from '@/apollo/types/gqlEnums';

const ProjectRoute: FC<IProjectBySlug> = ({ project }) => {
	useReferral();

	return (
		<ProjectProvider project={project}>
			<Head>
				<title>{project?.title} | Giveth</title>
				<ProjectMeta project={project} preTitle='Project' />
			</Head>
			<ProjectIndex />
		</ProjectProvider>
	);
};

export async function getServerSideProps(props: {
	query: { projectIdSlug: string };
}) {
	try {
		const { query } = props;
		const slug = decodeURI(query.projectIdSlug).replace(/\s/g, '');

		const { data } = await client.query({
			query: FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT,
			variables: { slug },
			fetchPolicy: 'no-cache',
			context: {
				skipAuth: true, // Skip authorization for this query
			},
		});

		// Perform redirect on server side for causes
		if (data.projectBySlug?.projectType === EProjectType.CAUSE) {
			return {
				redirect: {
					destination: `/cause/${data.projectBySlug.slug}`,
					permanent: false,
				},
			};
		}

		return {
			props: {
				project: data.projectBySlug,
			},
		};
	} catch (error) {
		// TODO: Handle 502 error
		return {
			props: {},
		};
	}
}

export default ProjectRoute;
