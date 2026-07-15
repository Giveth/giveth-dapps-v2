import { GetServerSideProps } from 'next/types';
import { GeneralMetatags } from '@/components/Metatag';
import QFRoundsIndex from '@/components/views/QFRounds/QFRoundsIndex';
import { projectsQFRoundMetatags } from '@/content/metatags';
import { QFRoundsProvider } from '@/context/qfrounds.context';
import { client } from '@/apollo/apolloClient';
import { FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { filterDisplayableQFRounds } from '@/lib/helpers/qfroundHelpers';
import Routes from '@/lib/constants/Routes';
import { IQFRound } from '@/apollo/types/types';

interface IQfLandingProps {
	qfRounds: IQFRound[] | null;
}

export default function QfLanding({ qfRounds }: IQfLandingProps) {
	return (
		<QFRoundsProvider initialQFRounds={qfRounds ?? undefined}>
			<GeneralMetatags info={projectsQFRoundMetatags} />
			<QFRoundsIndex />
		</QFRoundsProvider>
	);
}

// Redirect on the server so users don't see the hub flash before landing on
// the round page: single active round -> its page, none -> the archive.
export const getServerSideProps: GetServerSideProps = async context => {
	// Let the CDN absorb /qf traffic spikes around round launches; a
	// 60s-stale redirect decision is acceptable for round transitions.
	context.res.setHeader(
		'Cache-Control',
		'public, s-maxage=60, stale-while-revalidate=300',
	);
	try {
		const { data } = await client.query({
			query: FETCH_QF_ROUNDS_QUERY,
			variables: { activeOnly: true },
			fetchPolicy: 'no-cache',
		});
		const qfRounds: IQFRound[] = data?.qfRounds || [];
		const displayableRounds = filterDisplayableQFRounds(qfRounds);
		const destination =
			displayableRounds.length === 1 && displayableRounds[0].slug
				? `/qf/${displayableRounds[0].slug}`
				: displayableRounds.length === 0
					? Routes.QFArchived
					: null;
		if (destination) {
			const { locale, defaultLocale } = context;
			const localizedDestination =
				locale && locale !== defaultLocale
					? `/${locale}${destination}`
					: destination;
			const queryIndex = context.resolvedUrl.indexOf('?');
			const queryString =
				queryIndex > -1
					? context.resolvedUrl.substring(queryIndex + 1)
					: '';
			return {
				redirect: {
					destination: queryString
						? `${localizedDestination}?${queryString}`
						: localizedDestination,
					permanent: false,
				},
			};
		}
		return { props: { qfRounds } };
	} catch (error) {
		console.error('Error fetching QF rounds for /qf redirect:', error);
		// Don't let the CDN cache the degraded error-path page
		context.res.setHeader('Cache-Control', 'no-store');
	}
	// No initial data on error so the client-side fetch retries from scratch
	return { props: { qfRounds: null } };
};
