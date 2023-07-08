import { GetServerSideProps } from 'next/types';
import { IMainCategory } from '@/apollo/types/types';
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
import type { IProjectsRouteProps } from '.';

interface IProjectsCategoriesRouteProps extends IProjectsRouteProps {
	selectedMainCategory: IMainCategory;
}

const ProjectsCategoriesRoute = (props: IProjectsCategoriesRouteProps) => {
	const {
		projects,
		mainCategories,
		selectedMainCategory,
		totalCount,
		categories,
	} = props;
	useReferral();

	return (
		<ProjectsProvider
			mainCategories={mainCategories}
			selectedMainCategory={selectedMainCategory}
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

export const getServerSideProps: GetServerSideProps = async context => {
	const apolloClient = initializeApollo();
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
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

		const allCategoriesItem = {
			title: 'All',
			description: '',
			banner: '',
			slug: 'all',
			categories: [],
			selected: false,
		};

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
					mainCategory: updatedSelectedMainCategory.slug,
					notifyOnNetworkStatusChange,
				},
				fetchPolicy: 'network-only',
			});
			const { projects, totalCount, categories } = data.allProjects;
			return {
				props: {
					projects,
					mainCategories: updatedMainCategory,
					selectedMainCategory: updatedSelectedMainCategory,
					totalCount,
					categories,
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

export default ProjectsCategoriesRoute;
