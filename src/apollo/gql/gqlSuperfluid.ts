import { gql } from '@apollo/client';

export const CREATE_RECURRING_DONATION = gql`
	mutation CreateRecurringDonation(
		$projectId: Int!
		$networkId: Int!
		$txHash: String!
	) {
		createRecurringDonation(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
		) {
			txHash
			networkId
			project {
				id
			}
		}
	}
`;

export const CREATE_ANCHOR_CONTRACT_ADDRESS_QUERY = gql`
	mutation (
		$projectId: Int!
		$networkId: Int!
		$address: String!
		$txHash: String!
	) {
		addAnchorContractAddress(
			projectId: $projectId
			networkId: $networkId
			address: $address
			txHash: $txHash
		) {
			id
			address
			isActive
		}
	}
`;
