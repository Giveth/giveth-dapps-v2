import { GetServerSideProps } from 'next/types';
import { EProjectsFilter } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { IProjectsRouteProps } from 'pages/projects/[slug]';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

const QFProjectsCategoriesRoute = (props: IProjectsRouteProps) => {
	const { projects, totalCount } = props;
	return (
		<ProjectsProvider isQF>
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

		let _filters = query.filter
			? Array.isArray(query.filter)
				? query.filter
				: [query.filter]
			: undefined;

		_filters
			? _filters.push(EProjectsFilter.ACTIVE_QF_ROUND)
			: (_filters = [EProjectsFilter.ACTIVE_QF_ROUND]);

		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: {
				...variables,
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				searchTerm: query.searchTerm,
				filters: _filters,
				campaignSlug: query.campaignSlug,
				category: query.category,
				mainCategory: getMainCategorySlug({ slug }),
				notifyOnNetworkStatusChange,
			},
			fetchPolicy: 'no-cache',
		});
		const { projects, totalCount } = data.allProjects;
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

export default QFProjectsCategoriesRoute;
