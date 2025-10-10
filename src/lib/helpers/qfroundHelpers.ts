import { useQuery } from '@tanstack/react-query';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_ARCHIVED_QF_ROUNDS,
	FETCH_QF_ROUNDS_QUERY,
} from '@/apollo/gql/gqlQF';
import { IArchivedQFRound, IQFRound } from '@/apollo/types/types';

/**
 * @title useFetchLast3ArchivedQFRounds
 *
 * @description Fetch the last 3 archived QF rounds
 * @returns IArchivedQFRound[]
 */
export const useFetchLast3ArchivedQFRounds = () => {
	return useQuery({
		queryKey: ['archivedQFRounds', 'last3'],
		queryFn: async (): Promise<IArchivedQFRound[]> => {
			try {
				const { data } = await client.query({
					query: FETCH_ARCHIVED_QF_ROUNDS,
					variables: {
						limit: 3,
						skip: 0,
						orderBy: {
							field: 'beginDate',
							direction: 'DESC',
						},
					},
				});

				return data?.qfArchivedRounds || [];
			} catch (error) {
				console.error('Error fetching archived QF rounds:', error);
				throw error;
			}
		},
		enabled: true,
		refetchOnWindowFocus: false,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * @title useFetchQFRounds
 *
 * @description Fetch all QF rounds with optional activeOnly filter
 * @param activeOnly - If true, fetch only active rounds. If false, fetch all rounds
 * @returns IQFRound[]
 */
export const useFetchQFRounds = (activeOnly: boolean = false) => {
	return useQuery({
		queryKey: ['qfRounds', activeOnly],
		queryFn: async (): Promise<IQFRound[]> => {
			try {
				const { data } = await client.query({
					query: FETCH_QF_ROUNDS_QUERY,
					variables: {
						activeOnly,
					},
					fetchPolicy: 'no-cache',
				});

				return data?.qfRounds || [];
			} catch (error) {
				console.error('Error fetching QF rounds:', error);
				throw error;
			}
		},
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * @title getQFRoundImage
 *
 * @description Get the QF round image
 * @param qfRound - IQFRound
 * @param isMobile - boolean
 * @returns string
 */
export const getQFRoundImage = (
	qfRound: IQFRound,
	isMobile: boolean,
): string => {
	return (
		(isMobile ? qfRound.bannerMobile : qfRound.bannerFull) ||
		qfRound.bannerBgImage
	);
};

/**
 * @title getQFRoundHubCardImage
 *
 * @description Get the QF round hub card image
 * @param qfRound - IQFRound
 * @returns string
 */
export const getQFRoundHubCardImage = (qfRound: IQFRound): string => {
	return qfRound.hubCardImage || qfRound.bannerFull || qfRound.bannerBgImage;
};

/**
 * @title getQFRoundData
 *
 * @description Get the QF round data
 * @param slug - string
 * @returns IQFRound
 */
export const getQFRoundData = async (slug: string) => {
	const { data } = await client.query({
		query: FETCH_QF_ROUNDS_QUERY,
		variables: { slug },
		fetchPolicy: 'no-cache',
	});
	return data?.qfRounds[0];
};
