import { FC } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';

import { useReferral } from '@/hooks/useReferral';
import ProjectIndex from '@/components/views/project/ProjectIndex';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';

const ProjectRoute: FC<IProjectBySlug> = ({ project }) => {
	useReferral();

	return (
		<ProjectProvider project={project}>
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
}

export default ProjectRoute;
