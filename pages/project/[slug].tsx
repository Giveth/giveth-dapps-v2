import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import Head from 'next/head';
import ProjectIndex from '@/components/views/project/ProjectIndex';

const ProjectRoute = (props: IProjectBySlug) => {
	return (
		<>
			<Head>
				<title>{props.project.title} | Giveth</title>
			</Head>
			<ProjectIndex {...props} />
		</>
	);
};

export async function getServerSideProps(props: { query: { slug: string } }) {
	const { query } = props;
	const slug = decodeURI(query.slug).replace(/\s/g, '');

	const { data } = await client.query({
		query: FETCH_PROJECT_BY_SLUG,
		variables: { slug },
		fetchPolicy: 'no-cache',
	});
	const project = data.projectBySlug;

	return {
		props: {
			project,
		},
	};
}

export default ProjectRoute;
