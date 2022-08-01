import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import {
	FETCH_ALL_PROJECTS_NEW,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { ICategory, IMainCategory, IProject } from '@/apollo/types/types';
import { ProjectsProvider } from '@/context/projects.context';

export interface IProjectsRouteProps {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
	mainCategories: IMainCategory[];
}

const ProjectsRoute = (props: IProjectsRouteProps) => {
	const { projects, mainCategories, totalCount, categories } = props;
	return (
		<ProjectsProvider>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
				mainCategories={mainCategories}
			/>
		</ProjectsProvider>
	);
};

export async function getServerSideProps() {
	try {
		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS_NEW,
			...OPTIONS_HOME_PROJECTS,
			fetchPolicy: 'network-only',
		});

		const {
			data: { mainCategories },
		}: {
			data: { mainCategories: IMainCategory[] };
		} = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'network-only',
		});
		const allCategoriesItem = {
			title: 'All',
			description: '',
			banner: '',
			slug: 'all',
			categories: [],
			selected: false,
		};
		const updatedMaincategory = [allCategoriesItem, ...mainCategories];

		const { projects, totalCount, categories } = data.allProjects;
		return addApolloState(apolloClient, {
			props: {
				projects,
				mainCategories: updatedMaincategory,
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
