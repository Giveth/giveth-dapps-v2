import { GetServerSideProps } from 'next/types';
import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { EProjectsFilter, IMainCategory } from '@/apollo/types/types';
import { ProjectsProvider } from '@/context/projects.context';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { useReferral } from '@/hooks/useReferral';
import { IProjectsRouteProps } from 'pages/projects';

export const QF_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
		filters: [EProjectsFilter.ACTIVE_QF_ROUND],
	},
	notifyOnNetworkStatusChange: true,
};

const QFProjectsRoute = (props: IProjectsRouteProps) => {
	const { projects, mainCategories, totalCount, categories, qfRounds } =
		props;

	useReferral();

	return (
		<ProjectsProvider
			mainCategories={mainCategories}
			isQF={true}
			qfRounds={qfRounds}
		>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
			/>
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			...QF_PROJECTS,
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
		const updatedMainCategory = [allCategoriesItem, ...mainCategories];

		const { projects, totalCount, categories } = data.allProjects;
		const {
			data: { qfRounds },
		} = await apolloClient.query({
			query: FETCH_QF_ROUNDS,
			fetchPolicy: 'network-only',
		});
		return addApolloState(apolloClient, {
			props: {
				projects,
				mainCategories: updatedMainCategory,
				totalCount,
				categories,
				qfRounds,
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
};

export default QFProjectsRoute;
