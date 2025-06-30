import { GetServerSideProps } from 'next/types';
import { ICause, IMainCategory } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_CAUSES } from '@/apollo/gql/gqlOptions';
import { FETCH_ALL_CAUSES } from '@/apollo/gql/gqlCauses';
import { GeneralMetatags } from '@/components/Metatag';
import CausesIndex from '@/components/views/causes/CausesIndex';
import { useReferral } from '@/hooks/useReferral';
import { projectsMetatags } from '@/content/metatags';
import { CausesProvider } from '@/context/causes.context';
import { getMainCategorySlug } from '@/helpers/projects';
import { EProjectsSortBy, EProjectType } from '@/apollo/types/gqlEnums';

export interface ICausesRouteProps {
	causes: ICause[];
	totalCount: number;
	mainCategories: IMainCategory[];
	errorStatus?: number;
}

const CausesCategoriesRoute = (props: ICausesRouteProps) => {
	const { causes = [], totalCount = 0, errorStatus } = props;

	useReferral();

	console.log('CAUSES', causes);

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
		<CausesProvider>
			<GeneralMetatags info={projectsMetatags} />
			<CausesIndex causes={causes} totalCount={totalCount} />
		</CausesProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_CAUSES;
	try {
		const { query } = context;
		const slug = query.slug as string;
		console.log('SLUG:', slug);
		console.log('QUERY:', query);

		console.log('Sending variables:', variables);
		console.log('Project Type:', EProjectType.CAUSE);

		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_CAUSES,
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
			},
			fetchPolicy: 'no-cache',
		});
		console.log('GRAPHQL DATA:', data);
		const { projects: causes = [], totalCount = 0 } = data.allProjects;
		return {
			props: {
				causes,
				totalCount,
			},
		};
	} catch (error: any) {
		console.error('GRAPHQL ERROR:', error);
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
