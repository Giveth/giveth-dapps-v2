import { gql } from '@apollo/client';

export const FETCH_ALLOCATED_GIVBACKS = gql`
	query allocatedGivbacks($refreshCache: Boolean) {
		allocatedGivbacks(refreshCache: $refreshCache) {
			usdValueSentAmountInPowerRound
			allocatedGivTokens
			givPrice
			date
		}
	}
`;
