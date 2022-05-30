import Head from 'next/head';
import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { ICategory, IProject } from '@/apollo/types/types';
import { projectsMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { backendGQLRequest } from '@/helpers/requests';

interface IProjectsRoute {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
}

const ProjectsRoute = (props: IProjectsRoute) => {
	const { projects, totalCount, categories } = props;
	return (
		<>
			<Head>
				<GeneralMetatags info={projectsMetatags} />
			</Head>
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
			/>
		</>
	);
};

export async function getServerSideProps() {
	const apolloClient = initializeApollo();

	const { data } = await backendGQLRequest({
		query: FETCH_ALL_PROJECTS,
		...OPTIONS_HOME_PROJECTS,
	});

	const { projects, totalCount, categories } = data.projects;
	return addApolloState(apolloClient, {
		props: { projects, totalCount, categories },
	});
}

export default ProjectsRoute;
