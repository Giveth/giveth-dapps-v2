import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';

import ProjectIndex from '@/components/views/project/ProjectIndex';

const ProjectRoute = (props: { project?: IProject }) => {
	return <ProjectIndex project={props.project} />;
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
	} catch (e) {
		console.log({ e });
		captureException(e, {
			tags: {
				section: 'ProjectSSR',
			},
		});
		return {
			props: {},
		};
		// throw new Error('Erorr on FETCH_PROJECT_BY_SLUG');
	}
}

export default ProjectRoute;
