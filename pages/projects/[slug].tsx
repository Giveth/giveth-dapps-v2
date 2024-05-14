import { GetStaticProps } from 'next/types';
import { IMainCategory, IProject, IQFRound } from '@/apollo/types/types';
import { initializeApollo } from '@/apollo/apolloClient';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';

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

// This function gets called at build time
export async function getStaticPaths() {
	const apolloClient = initializeApollo();

	// Call an external API endpoint to get posts
	const { data } = await apolloClient.query({
		query: FETCH_MAIN_CATEGORIES,
		fetchPolicy: 'no-cache', // Adjust based on your caching policy needs
	});

	const mainCategories = data.mainCategories as IMainCategory[];

	// Get the paths we want to pre-render based on posts
	const _paths = mainCategories.map(category => ({
		params: { slug: category.slug },
	}));

	const paths = [{ params: { slug: 'all' } }, ..._paths];

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const apolloClient = initializeApollo();
	const { variables } = OPTIONS_HOME_PROJECTS;

	try {
		// Fetch main categories
		const { data: mainCategoriesData } = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'no-cache', // Adjust based on your caching policy needs
		});

		// Fetch projects with a predefined sorting
		const { data: projectsData } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: {
				...variables,
				mainCategory: params?.slug === 'all' ? null : params?.slug,
			},
			fetchPolicy: 'no-cache',
		});

		// Fetch QF rounds
		const { data: qfRoundsData } = await apolloClient.query({
			query: FETCH_QF_ROUNDS,
			fetchPolicy: 'no-cache',
		});

		const updatedMainCategory = [
			allCategoriesItem,
			...mainCategoriesData.mainCategories,
		];

		const selectedMainCategory = updatedMainCategory.find(mainCategory => {
			return mainCategory.slug === params?.slug;
		});

		return {
			props: {
				projects: projectsData.allProjects.projects,
				totalCount: projectsData.allProjects.totalCount,
				mainCategories: updatedMainCategory,
				qfRounds: qfRoundsData.qfRounds,
				selectedMainCategory,
			},
			revalidate: 300, // Optionally, revalidate at most once per hour
		};
	} catch (error) {
		console.error('Failed to fetch API:', error);
		return { props: { hasError: true } };
	}
};

export default ProjectsCategoriesRoute;
