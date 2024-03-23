import { gql } from '@apollo/client';

export const CREATE_RECURRING_DONATION = gql`
	mutation CreateRecurringDonation(
		$projectId: Int!
		$networkId: Int!
		$txHash: String!
		$flowRate: String!
		$currency: String!
	) {
		createRecurringDonation(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
			flowRate: $flowRate
			currency: $currency
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

export const UPDATE_RECURRING_DONATION = gql`
	mutation updateRecurringDonationQuery(
		$projectId: Int!
		$networkId: Int!
		$currency: String!
		$txHash: String
		$flowRate: String
		$anonymous: Boolean
		$status: String
	) {
		updateRecurringDonationParams(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
			anonymous: $anonymous
			flowRate: $flowRate
			currency: $currency
			status: $status
		) {
			txHash
			networkId
			currency
			flowRate
			anonymous
			status
		}
	}
`;
