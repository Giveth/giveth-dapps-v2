import ProjectIndex from '@/components/views/project/ProjectIndex';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';

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
		return {
			props: {
				project: null,
			},
		};
	}
}

export default ProjectRoute;
