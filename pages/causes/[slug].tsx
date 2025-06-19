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
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';

export interface ICausesRouteProps {
	causes: ICause[];
	totalCount: number;
	mainCategories: IMainCategory[];
}

const CausesCategoriesRoute = (props: ICausesRouteProps) => {
	const { causes, totalCount } = props;

	useReferral();

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
		const { causes, totalCount } = data.allCauses;
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
