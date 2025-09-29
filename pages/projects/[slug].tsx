import { GetServerSideProps } from 'next/types';
import { IMainCategory, IProject } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS_NEW } from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { useReferral } from '@/hooks/useReferral';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

export interface IProjectsRouteProps {
	projects: IProject[];
	totalCount: number;
	mainCategories: IMainCategory[];
}

const ProjectsCategoriesRoute = (props: IProjectsRouteProps) => {
	const { projects, totalCount } = props;

	useReferral();

	return (
		<ProjectsProvider>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex projects={projects} totalCount={totalCount} />
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const { query } = context;
		const slug = query.slug as string;
		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS_NEW,
			variables: {
				...variables,
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				searchTerm: query.searchTerm,
				filters: query.filter
					? Array.isArray(query.filter)
						? query.filter
						: [query.filter]
					: null,
				campaignSlug: query.campaignSlug,
				category: query.category,
				mainCategory: getMainCategorySlug({ slug }),
				notifyOnNetworkStatusChange,
			},
			fetchPolicy: 'no-cache',
		});
		const { projects, totalCount } = data.newAllProjects;
		return {
			props: {
				projects,
				totalCount,
			},
		};
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
};

export default ProjectsCategoriesRoute;
