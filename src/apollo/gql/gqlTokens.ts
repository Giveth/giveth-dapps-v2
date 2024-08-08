import { gql } from '@apollo/client';

export const FETCH_TOKEN_DETAILS = gql`
	query getTokensDetails($address: String!, $networkId: Int!) {
		getTokensDetails(address: $address, networkId: $networkId) {
			id
			symbol
			networkId
			chainType
			address
			name
			decimals
			mainnetAddress
			isGivbackEligible
			order
			isStableCoin
			coingeckoId
			isQR
		}
	}
`;
