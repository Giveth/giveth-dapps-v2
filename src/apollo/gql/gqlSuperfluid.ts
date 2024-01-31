import { gql } from '@apollo/client';

export const CREATE_RECURRING_DONATION = gql`
	mutation ($projectId: Int!, $networkId: Int!, $txHash: String!) {
		createRecurringDonation(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
		) {
			txHash
			networkId
		}
	}
`;
