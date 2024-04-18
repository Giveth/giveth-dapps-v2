import { gql } from '@apollo/client';

export const CREATE_DRAFT_RECURRING_DONATION = gql`
	mutation createDraftRecurringDonation(
		$networkId: Float!
		$currency: String!
		$projectId: Float!
		$recurringDonationId: Float
		$anonymous: Boolean
		$isBatch: Boolean
		$isForUpdate: Boolean
		$flowRate: String!
	) {
		createDraftRecurringDonation(
			networkId: $networkId
			currency: $currency
			recurringDonationId: $recurringDonationId
			projectId: $projectId
			anonymous: $anonymous
			isBatch: $isBatch
			isForUpdate: $isForUpdate
			flowRate: $flowRate
		)
	}
`;

export const CREATE_RECURRING_DONATION = gql`
	mutation CreateRecurringDonation(
		$projectId: Int!
		$networkId: Int!
		$txHash: String!
		$flowRate: String!
		$currency: String!
		$anonymous: Boolean
		$isBatch: Boolean
	) {
		createRecurringDonation(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
			flowRate: $flowRate
			currency: $currency
			anonymous: $anonymous
			isBatch: $isBatch
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
		$isArchived: Boolean
		$status: String
	) {
		updateRecurringDonationParams(
			projectId: $projectId
			networkId: $networkId
			txHash: $txHash
			anonymous: $anonymous
			flowRate: $flowRate
			currency: $currency
			isArchived: $isArchived
			status: $status
		) {
			id
			txHash
			networkId
			currency
			flowRate
			anonymous
			status
			isArchived
		}
	}
`;

export const UPDATE_RECURRING_DONATION_BY_ID = gql`
	mutation updateRecurringDonationQueryById(
		$recurringDonationId: Int!
		$projectId: Int!
		$networkId: Int!
		$currency: String!
		$txHash: String
		$flowRate: String
		$anonymous: Boolean
		$isArchived: Boolean
		$status: String
	) {
		updateRecurringDonationParamsById(
			recurringDonationId: $recurringDonationId
			projectId: $projectId
			networkId: $networkId
			currency: $currency
			txHash: $txHash
			anonymous: $anonymous
			flowRate: $flowRate
			status: $status
			isArchived: $isArchived
		) {
			id
			txHash
			networkId
			currency
			flowRate
			anonymous
			status
			isArchived
		}
	}
`;

export const UPDATE_RECURRING_DONATION_STATUS = gql`
	mutation updateRecurringDonationStatus(
		$status: String
		$donationId: Float!
	) {
		updateRecurringDonationStatus(
			status: $status
			donationId: $donationId
		) {
			id
			status
		}
	}
`;
