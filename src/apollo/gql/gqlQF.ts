import { gql } from '@apollo/client';

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
