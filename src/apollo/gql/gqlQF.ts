import { gql } from '@apollo/client';

export const FETCH_QF_ROUNDS = gql`
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
