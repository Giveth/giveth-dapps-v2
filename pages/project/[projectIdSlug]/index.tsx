import { captureException } from '@sentry/nextjs';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';

import ProjectIndex from '@/components/views/project/ProjectIndex';
import { backendGQLRequest } from '@/helpers/requests';

const ProjectRoute = (props: { project?: IProject }) => {
	return <ProjectIndex project={props.project} />;
};

export async function getServerSideProps(props: {
	query: { projectIdSlug: string };
}) {
	try {
		const { query } = props;
		const slug = decodeURI(query.projectIdSlug).replace(/\s/g, '');

		const { data } = await backendGQLRequest({
			query: FETCH_PROJECT_BY_SLUG,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});

		return {
			props: {
				project: data.projectBySlug,
			},
		};
	} catch (e) {
		console.log({ e });
		captureException(e, {
			tags: {
				section: 'ProjectSSR',
			},
		});
		return {
			props: {
				project: null,
			},
		};
	}
}

export default ProjectRoute;
