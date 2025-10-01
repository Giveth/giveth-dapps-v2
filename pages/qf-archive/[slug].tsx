import { GetServerSideProps } from 'next/types';
import { IQFRound } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { GeneralMetatags } from '@/components/Metatag';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { useReferral } from '@/hooks/useReferral';
import { IProjectsRouteProps } from 'pages/projects/[slug]';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { FETCH_QF_PROJECTS, FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { getQFRoundData } from '@/lib/helpers/qfroundHelpers';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';

interface IProjectsCategoriesRouteProps extends IProjectsRouteProps {
	archivedQFRound: IQFRound;
}

const QFProjectsCategoriesRoute = (props: IProjectsCategoriesRouteProps) => {
	const { projects, totalCount, archivedQFRound } = props;

	useReferral();

	return (
		<ProjectsProvider isQF isArchivedQF archivedQFRound={archivedQFRound}>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				qfRound={archivedQFRound}
			/>
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

		// Get round data from database
		const roundData = await getQFRoundData(slug.toString());

		const { data } = await apolloClient.query({
			query: FETCH_QF_PROJECTS,
			variables: {
				...variables,
				qfRoundId: Number(roundData.id),
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				campaignSlug: query.campaignSlug,
				qfRoundSlug: slug,
				notifyOnNetworkStatusChange,
			},
			fetchPolicy: 'no-cache',
		});

		const { projects, totalCount } = data.qfProjects;
		const {
			data: { qfRounds },
		} = await apolloClient.query({
			query: FETCH_QF_ROUNDS_QUERY,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});

		const archivedQFRound = qfRounds ? qfRounds[0] : undefined;

		return {
			props: {
				projects,
				totalCount,
				archivedQFRound,
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
