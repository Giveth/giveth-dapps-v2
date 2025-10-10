import { GetServerSideProps } from 'next/types';
import { ICause, IMainCategory } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_CAUSES } from '@/apollo/gql/gqlOptions';
import { GeneralMetatags } from '@/components/Metatag';
import CausesIndex from '@/components/views/causes/CausesIndex';
import { useReferral } from '@/hooks/useReferral';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy, EProjectType } from '@/apollo/types/gqlEnums';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';

export interface ICausesRouteProps {
	causes: ICause[];
	totalCount: number;
	mainCategories: IMainCategory[];
	errorStatus?: number;
}

const CausesCategoriesRoute = (props: ICausesRouteProps) => {
	const { causes = [], totalCount = 0, errorStatus } = props;

	useReferral();

	// Handle error case
	if (errorStatus) {
		return (
			<div>
				<h1>Error {errorStatus}</h1>
				<p>Something went wrong loading the causes.</p>
			</div>
		);
	}

	return (
		<ProjectsProvider isCauses={true}>
			<GeneralMetatags info={projectsMetatags} />
			<CausesIndex causes={causes} totalCount={totalCount} />
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_CAUSES;
	try {
		const { query } = context;
		const slug = query.slug as string;

		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			variables: {
				...variables,
				sortingBy: query.sort || EProjectsSortBy.INSTANT_BOOSTING,
				searchTerm: query.searchTerm,
				filters: query.filter
					? Array.isArray(query.filter)
						? query.filter
						: [query.filter]
					: null,
				campaignSlug: query.campaignSlug,
				category: query.category,
				mainCategory: getMainCategorySlug({ slug }),
				notifyOnNetworkStatusChange,
				projectType: EProjectType.CAUSE,
			},
		});
		const { projects: causes = [], totalCount = 0 } = data.allProjects;
		return {
			props: {
				causes,
				totalCount,
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

export default CausesCategoriesRoute;
