import { gql } from '@apollo/client';

export const CREATE_RECURRING_DONATION = gql`
	mutation CreateRecurringDonation(
		$projectId: Int!
		$networkId: Int!
		$txHash: String!
		$interval: String!
		$amount: Int!
		$currency: String!
	) {
		createRecurringDonation(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
			amount: $amount
			currency: $currency
			interval: $interval
		) {
			id
			txHash
			networkId
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
