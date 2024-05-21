import { gql } from '@apollo/client';

export const FETCH_QF_ROUNDS_QUERY = `
	query FetchQFRounds {
		qfRounds {
			id
			slug
			name
			isActive
			beginDate
			endDate
			minimumPassportScore
			title
			description
			bannerBgImage
			sponsorsImgs
			allocatedFund
			allocatedFundUSD
			allocatedFundUSDPreferred
			allocatedTokenSymbol
		}
	}
`;

export const FETCH_QF_ROUNDS = gql`
	${FETCH_QF_ROUNDS_QUERY}
`;

export const FETCH_DOES_DONATED_PROJECT_IN_ROUND = gql`
	query ($projectId: Int!, $qfRoundId: Int!, $userId: Int!) {
		doesDonatedToProjectInQfRound(
			projectId: $projectId
			qfRoundId: $qfRoundId
			userId: $userId
		)
	}
`;

export const FETCH_QF_ROUND_STATS = gql`
	query fetchQfRoundStats($slug: String!) {
		qfRoundStats(slug: $slug) {
			uniqueDonors
			allDonationsUsdValue
			matchingPool
			qfRound {
				allocatedFund
				allocatedFundUSD
				allocatedFundUSDPreferred
				allocatedTokenSymbol
			}
		}
	}
`;

export const FETCH_ARCHIVED_QF_ROUNDS = gql`
	query fetchQFArchivedRounds(
		$limit: Int
		$skip: Int
		$orderBy: QfArchivedRoundsOrderBy
	) {
		qfArchivedRounds(limit: $limit, skip: $skip, orderBy: $orderBy) {
			id
			name
			slug
			isActive
			allocatedFund
			allocatedFundUSD
			allocatedTokenSymbol
			eligibleNetworks
			beginDate
			endDate
			totalDonations
			uniqueDonors
		}
	}
`;
