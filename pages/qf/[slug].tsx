import { GetServerSideProps } from 'next/types';
import { EProjectsFilter } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { GeneralMetatags } from '@/components/Metatag';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { IProjectsRouteProps } from 'pages/projects/[slug]';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy, EProjectType } from '@/apollo/types/gqlEnums';
import { FETCH_QF_PROJECTS } from '@/apollo/gql/gqlQF';
import { getQFRoundData } from '@/lib/helpers/qfroundHelpers';

const QFProjectsCategoriesRoute = (
	props: IProjectsRouteProps & { roundData?: any },
) => {
	const { projects, totalCount, roundData } = props;
	return (
		<ProjectsProvider isQF>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				qfRound={roundData}
			/>
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const { query } = context;
		const slug = query.slug as string;

		// GEt round data from database
		const roundData = await getQFRoundData(slug);

		console.log('roundData', roundData);

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
			query: FETCH_QF_PROJECTS,
			variables: {
				...variables,
				qfRoundId: Number(roundData.id),
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				searchTerm: query.searchTerm,
				filters: _filters,
				campaignSlug: query.campaignSlug,
				category: query.category,
				mainCategory: getMainCategorySlug({ slug }),
				notifyOnNetworkStatusChange,
				projectType: EProjectType.ALL,
			},
			fetchPolicy: 'no-cache',
		});
		const { projects, totalCount } = data.qfProjects;
		return {
			props: {
				projects,
				totalCount,
				roundData,
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
