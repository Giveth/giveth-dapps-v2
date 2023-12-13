import { gql } from '@apollo/client';
import { PROJECT_CARD_FIELDS } from './gqlProjects';

export const FETCH_QF_ROUNDS_QUERY = `
	query FetchQFRounds {
		qfRounds {
			id
			name
			isActive
			beginDate
			endDate
			minimumPassportScore
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

export const FETCH_ARCHIVED_QF_ROUND_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchAllProjects(
		$limit: Int
		$skip: Int
		$sortingBy: SortingField
		$connectedWalletUserId: Int
		$qfRoundSlug: String
	) {
		allProjects(
			limit: $limit
			skip: $skip
			sortingBy: $sortingBy
			connectedWalletUserId: $connectedWalletUserId
			qfRoundSlug: $qfRoundSlug
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;
