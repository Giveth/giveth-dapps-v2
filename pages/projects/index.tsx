import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import ProjectsIndex, {
	IProjectsView,
} from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { mainCategoriesMock } from './[slug]';

interface IProjectsRoute extends IProjectsView {}

const ProjectsRoute = (props: IProjectsRoute) => {
	const { projects, mainCategories, totalCount, categories } = props;
	return (
		<>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
				mainCategories={mainCategories}
			/>
		</>
	);
};

export async function getServerSideProps() {
	try {
		const apolloClient = initializeApollo();

		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			...OPTIONS_HOME_PROJECTS,
			fetchPolicy: 'network-only',
		});

		const { projects, totalCount, categories } = data.projects;
		return addApolloState(apolloClient, {
			props: {
				projects,
				mainCategories: mainCategoriesMock,
				totalCount,
				categories,
			},
		});
	} catch (error: any) {
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}
}

export default ProjectsRoute;
