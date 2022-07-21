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
import { projectsMetatags } from '@/content/metatags';
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

	return (
		<>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
				mainCategories={mainCategories}
				selectedMainCategory={selectedMainCategory}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const apolloClient = initializeApollo();

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

		const updatedMaincategory = [allCategoriesItem, ...mainCategories];
		const selectedMainCategory = updatedMaincategory.find(mainCategory => {
			return mainCategory.slug === slug;
		});

		if (selectedMainCategory) {
			const updatedSelectedMainCategoru = {
				...selectedMainCategory,
				selected: true,
			};
			const apolloClient = initializeApollo();
			const { data } = await apolloClient.query({
				query: FETCH_ALL_PROJECTS,
				...OPTIONS_HOME_PROJECTS,
				fetchPolicy: 'network-only',
			});
			const { projects, totalCount, categories } = data.projects;

			return {
				props: {
					projects,
					mainCategories: updatedMaincategory,
					selectedMainCategory: updatedSelectedMainCategoru,
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

// Mock Data
export const mainCategoriesMock: IMainCategory[] = [
	{
		title: 'Environment & Energy',
		banner: '/images/banners/categories/environment.png',
		slug: 'environment-and-energy',
		description:
			'Agriculture, Air, Climate, Energy, Land,Oceans, Pollution, Waste, Water, Biodiversity',
		categories: [
			{
				name: 'agriculture',
				value: 'Agriculture',
				isActive: true,
			},
			{
				name: 'air',
				value: 'Air',
				isActive: true,
			},
			{
				name: 'biodiversity',
				value: 'Biodiversity',
				isActive: true,
			},
			{
				name: 'climate',
				value: 'Climate',
				isActive: true,
			},
			{
				name: 'energy',
				value: 'Energy',
				isActive: true,
			},
			{
				name: 'land',
				value: 'Land',
				isActive: true,
			},
			{
				name: 'oceans',
				value: 'Oceans',
				isActive: true,
			},
			{
				name: 'pollution',
				value: 'Pollution',
				isActive: true,
			},
			{
				name: 'waste',
				value: 'Waste',
				isActive: true,
			},
			{
				name: 'water',
				value: 'Water',
				isActive: true,
			},
		],
	},
	{
		title: 'Economics & Infrastructure',
		banner: '/images/banners/categories/economics.png',
		slug: 'economic-and-infrastructure',
		description: '',
		categories: [
			{
				name: 'housing',
				value: 'Housing',
				isActive: true,
			},
			{
				name: 'employment',
				value: 'Employment',
				isActive: true,
			},
			{
				name: 'finance',
				value: 'Finance',
				isActive: true,
			},
			{
				name: 'infrastructure',
				value: 'Infrastructure',
				isActive: true,
			},
			{
				name: 'real-estate',
				value: 'Real State',
				isActive: true,
			},
		],
	},
	{
		title: 'Health & Wellness',
		banner: '/images/banners/categories/health.png',
		slug: 'health-and-wellness',
		description: '',
		categories: [
			{
				name: 'food',
				value: 'Food',
				isActive: true,
			},
			{
				name: 'nutrition',
				value: 'Nutrition',
				isActive: true,
			},
			{
				name: 'health',
				value: 'Health',
				isActive: true,
			},
		],
	},
	{
		title: 'Technology & Education',
		banner: '/images/banners/categories/technology.png',
		slug: 'technology-and-education',
		description: '',
		categories: [
			{
				name: 'technology',
				value: 'Technology',
				isActive: true,
			},
			{
				name: 'research',
				value: 'Research',
				isActive: true,
			},
			{
				name: 'education',
				value: 'Education',
				isActive: true,
			},
		],
	},
	{
		title: 'Art & Culture',
		banner: '/images/banners/categories/art.png',
		slug: 'art-and-culture',
		description: '',
		categories: [
			{
				name: 'art-culture',
				value: 'Art & Culture',
				isActive: true,
			},
			{
				name: 'community',
				value: 'Community',
				isActive: true,
			},
			{
				name: 'inclusion',
				value: 'Inclusion',
				isActive: true,
			},
		],
	},
	{
		title: 'Non-profit',
		banner: '/images/banners/categories/nonprofit.png',
		slug: 'non-profit',
		description: '',
		categories: [
			{
				name: 'non-profit',
				value: 'Non-profit',
				isActive: true,
			},
			{
				name: 'the-giving-block',
				value: 'The Giving block',
				isActive: true,
			},
		],
	},
];

export default ProjectsCategoriesRoute;
