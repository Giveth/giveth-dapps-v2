import { GetServerSideProps } from 'next/types';
import { IMainCategory } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { IProjectsRoute } from '.';

interface IProjectsCategoriesRoute extends IProjectsRoute {
	mainCategories: IMainCategory[];
}

const ProjectsCategoriesRoute = (props: IProjectsCategoriesRoute) => {
	const { projects, mainCategories, totalCount, categories } = props;

	return (
		<>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
			/>
			<div></div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	try {
		const { query } = context;
		const slug = query.address;
		if (!slug)
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		const category = mainCategoriesMock.find(
			mainCategory => mainCategory.slug === slug,
		);
		if (category) {
			category.selected = true;
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
					mainCategories: mainCategoriesMock,
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
const mainCategoriesMock: IMainCategory[] = [
	{
		title: 'Environment & Energy',
		banner: '',
		slug: 'environment-and-energy',
		description: '',
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
		banner: '',
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
		banner: '',
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
		banner: '',
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
		banner: '',
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
		banner: '',
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
