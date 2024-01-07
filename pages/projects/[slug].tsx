import { GetStaticProps } from 'next/types';
import { IMainCategory, IProject, IQFRound } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { useReferral } from '@/hooks/useReferral';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

export interface IProjectsRouteProps {
	projects: IProject[];
	totalCount: number;
	mainCategories: IMainCategory[];
	qfRounds: IQFRound[];
}

export const allCategoriesItem = {
	title: 'All',
	description: '',
	banner: '',
	slug: 'all',
	categories: [],
	selected: false,
};

interface IProjectsCategoriesRouteProps extends IProjectsRouteProps {
	selectedMainCategory: IMainCategory;
}

const ProjectsCategoriesRoute = (props: IProjectsCategoriesRouteProps) => {
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
			isQF={false}
			qfRounds={qfRounds}
		>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex projects={projects} totalCount={totalCount} />
		</ProjectsProvider>
	);
};

export async function getStaticPaths() {
	const apolloClient = initializeApollo();
	const {
		data: { mainCategories },
	}: {
		data: { mainCategories: IMainCategory[] };
	} = await apolloClient.query({
		query: FETCH_MAIN_CATEGORIES,
	});
	const paths = mainCategories.map(c => {
		return {
			params: {
				slug: c.slug,
			},
		};
	});
	return {
		paths,
		fallback: 'blocking', //false or "blocking" // See the "fallback" section below
	};
}

export const getStaticProps: GetStaticProps = async context => {
	const apolloClient = initializeApollo();
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const { params } = context;
		const slug = params?.slug;

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
			const { data } = await apolloClient.query({
				query: FETCH_ALL_PROJECTS,
				variables: {
					...variables,
					sortingBy: params?.sort || EProjectsSortBy.INSTANT_BOOSTING,
					searchTerm: params?.searchTerm,
					filters: params?.filter
						? Array.isArray(params?.filter)
							? params?.filter
							: [params?.filter]
						: null,
					campaignSlug: params?.campaignSlug,
					category: params?.category,
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
				revalidate: 600,
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

export default ProjectsCategoriesRoute;
