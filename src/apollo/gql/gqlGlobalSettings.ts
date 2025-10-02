import { gql } from '@apollo/client';

export const FETCH_GLOBAL_SCORE_SETTINGS = gql`
	query {
		globalScoreSettings {
			globalMinimumPassportScore
			globalMinimumMBDScore
		}
	}
`;
