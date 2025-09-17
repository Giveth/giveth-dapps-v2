// apollo/gql/gqlQF.ts

import { gql } from '@apollo/client';

export const QF_ROUNDS_QUERY = `
		qfRounds(slug: $slug, activeOnly: $activeOnly, sortBy: $sortBy) {
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
			priority
			displaySize
			bannerFull
			bannerMobile
		}
`;

export const FETCH_QF_ROUNDS_QUERY = gql`
	query FetchQFRounds($slug: String, $activeOnly: Boolean, $sortBy: QfRoundsSortType) {
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
			description
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
			bannerBgImage
			bannerFull
			bannerMobile
		}
	}
`;

export const FETCH_QF_ROUND_SMART_SELECT = gql`
	query FetchQfRoundSmartSelect($projectId: Int!, $networkId: Int!) {
		qfRoundSmartSelect(projectId: $projectId, networkId: $networkId) {
			qfRoundId
			qfRoundName
			matchingPoolAmount
			eligibleNetworks
			allocatedFundUSD
			projectUsdAmountRaised
			uniqueDonors
			donationsCount
		}
	}
`;

export const FETCH_QF_PROJECTS = gql`
	query FetchQfProjects(
		$skip: Int
		$limit: Int
		$sortingBy: SortingField
		$filters: [FilterField!]
		$searchTerm: String
		$qfRoundId: Int!
	) {
		qfProjects(
			skip: $skip
			limit: $limit
			sortingBy: $sortingBy
			filters: $filters
			searchTerm: $searchTerm
			qfRoundId: $qfRoundId
		) {
			projects {
				id
				title
				descriptionSummary
				updatedAt
				addresses {
					address
					isRecipient
					networkId
					chainType
				}
				image
				totalRaisedUsd
				qfRoundStats {
					roundId
					totalRaisedInRound
					totalDonorsInRound
				}
				qfRounds {
					id
					name
					priority
					endDate
					isActive
				}
			}
			totalCount
		}
	}
`;
