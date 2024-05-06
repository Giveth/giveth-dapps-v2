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
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';

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
	console.log('props', props);

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

export const getStaticProps: GetStaticProps = async () => {
	const apolloClient = initializeApollo();

	try {
		// Fetch main categories
		const { data: mainCategoriesData } = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'no-cache', // Adjust based on your caching policy needs
		});

		// Fetch projects with a predefined sorting
		const { data: projectsData } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: { sortingBy: EProjectsSortBy.INSTANT_BOOSTING },
			fetchPolicy: 'no-cache',
		});

		// Fetch qualification rounds
		const { data: qfRoundsData } = await apolloClient.query({
			query: FETCH_QF_ROUNDS,
			fetchPolicy: 'no-cache',
		});

		return {
			props: {
				projects: projectsData.allProjects.projects,
				totalCount: projectsData.allProjects.totalCount,
				mainCategories: [
					allCategoriesItem,
					...mainCategoriesData.mainCategories,
				],
				qfRounds: qfRoundsData.qfRounds,
			},
			revalidate: 3600, // Optionally, revalidate at most once per hour
		};
	} catch (error) {
		console.error('Failed to fetch API:', error);
		return { props: { hasError: true } };
	}
};

export default ProjectsCategoriesRoute;
