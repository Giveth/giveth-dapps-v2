import { GetServerSideProps } from 'next/types';
import { EProjectsFilter, IMainCategory } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { useReferral } from '@/hooks/useReferral';
import { IProjectsRouteProps, allCategoriesItem } from 'pages/projects/all';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

interface IProjectsCategoriesRouteProps extends IProjectsRouteProps {
	selectedMainCategory: IMainCategory;
}

const QFProjectsCategoriesRoute = (props: IProjectsCategoriesRouteProps) => {
	const {
		projects,
		mainCategories,
		selectedMainCategory,
		totalCount,
		qfRounds,
	} = props;

	useReferral();

	return (
		<ProjectsProvider
			mainCategories={mainCategories}
			selectedMainCategory={selectedMainCategory}
			qfRounds={qfRounds}
			isQF
		>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex projects={projects} totalCount={totalCount} />
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const apolloClient = initializeApollo();
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const { query } = context;
		const slug = query.slug;

		const {
			data: { mainCategories },
		}: {
			data: { mainCategories: IMainCategory[] };
		} = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'network-only',
		});

		const updatedMainCategory = [allCategoriesItem, ...mainCategories];
		const selectedMainCategory = updatedMainCategory.find(mainCategory => {
			return mainCategory.slug === slug;
		});

		if (selectedMainCategory) {
			const updatedSelectedMainCategory = {
				...selectedMainCategory,
				selected: true,
			};
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
					mainCategory: getMainCategorySlug(
						updatedSelectedMainCategory,
					),
					notifyOnNetworkStatusChange,
				},
				fetchPolicy: 'network-only',
			});
			const { projects, totalCount } = data.allProjects;
			const {
				data: { qfRounds },
			} = await apolloClient.query({
				query: FETCH_QF_ROUNDS,
				fetchPolicy: 'network-only',
			});
			return {
				props: {
					projects,
					mainCategories: updatedMainCategory,
					selectedMainCategory: updatedSelectedMainCategory,
					totalCount,
					qfRounds,
				},
			};
		}
		return {
			notFound: true,
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
