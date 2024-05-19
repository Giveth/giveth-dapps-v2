import { GetServerSideProps } from 'next/types';
import { IMainCategory, IQFRound } from '@/apollo/types/types';
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
import { IProjectsRouteProps, allCategoriesItem } from 'pages/projects/[slug]';
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
			isQF={true}
			isArchivedQF={true}
			qfRounds={qfRounds}
		>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex projects={projects} totalCount={totalCount} />
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const apolloClient = initializeApollo();

		const { query } = context;
		const slug = query.slug;
		if (!slug)
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};

		const {
			data: { mainCategories },
		}: {
			data: { mainCategories: IMainCategory[] };
		} = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'network-only',
		});

		const updatedMainCategory = [allCategoriesItem, ...mainCategories];

		const updatedSelectedMainCategory = {
			...allCategoriesItem,
			selected: true,
		};

		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: {
				...variables,
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				campaignSlug: query.campaignSlug,
				qfRoundSlug: slug,
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

		const roundExists = (qfRounds as IQFRound[]).some(
			round => round.slug === slug,
		);

		if (!roundExists) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				projects,
				mainCategories: updatedMainCategory,
				selectedMainCategory: updatedSelectedMainCategory,
				totalCount,
				qfRounds,
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
