import { gql } from '@apollo/client';

export const QF_ROUNDS_QUERY = `
		qfRounds(slug: $slug, activeOnly: $activeOnly) {
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
			minMBDScore
			minimumValidUsdValue
			eligibleNetworks
		}
`;

export const FETCH_QF_ROUNDS_QUERY = gql`
	query FetchQFRounds($slug: String, $activeOnly: Boolean) {
		${QF_ROUNDS_QUERY}
	}
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
			donationsCount
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
			isDataAnalysisDone
		}
	}
`;
