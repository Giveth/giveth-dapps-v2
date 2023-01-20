import { FC } from 'react';
import { GetStaticProps } from 'next/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';

import ProjectIndex from '@/components/views/project/ProjectIndex';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';

const ProjectRoute: FC<IProjectBySlug> = ({ project }) => {
	return (
		<ProjectProvider project={project}>
			<ProjectIndex />
		</ProjectProvider>
	);
};

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking', //false or "blocking" // See the "fallback" section below
	};
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	try {
		const slug = decodeURI(params?.projectIdSlug as string).replace(
			/\s/g,
			'',
		);
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
		// TODO: Handle 502 error
		return {
			props: {},
		};
	}
};

export default ProjectRoute;
