import { gql } from '@apollo/client';

export const FETCH_PROJECT_DONATIONS = gql`
	query DonationsByProjectId(
		$take: Int
		$skip: Int
		$traceable: Boolean
		$projectId: Int!
		$searchTerm: String
		$orderBy: SortBy
		$status: String
	) {
		donationsByProjectId(
			take: $take
			skip: $skip
			traceable: $traceable
			projectId: $projectId
			searchTerm: $searchTerm
			orderBy: $orderBy
			status: $status
		) {
			donations {
				id
				anonymous
				user {
					name
				}
				fromWalletAddress
				amount
				valueUsd
				currency
				transactionId
				transactionNetworkId
				createdAt
				donationType
				status
			}
			totalCount
		}
	}
`;

export const WALLET_DONATIONS = gql`
	query donationsFromWallets($fromWalletAddresses: [String!]!) {
		donationsFromWallets(fromWalletAddresses: $fromWalletAddresses) {
			transactionId
			transactionNetworkId
			toWalletAddress
			fromWalletAddress
			anonymous
			amount
			valueUsd
			valueEth
			priceEth
			priceUsd
			user {
				id
				firstName
				lastName
			}
			project {
				title
			}
			createdAt
			currency
		}
	}
`;

export const SAVE_DONATION = gql`
	mutation (
		$chainId: Float!
		$fromAddress: String!
		$toAddress: String!
		$transactionId: String
		$transactionNetworkId: Float!
		$amount: Float!
		$token: String!
		$projectId: Float!
		$transakId: String
		$transakStatus: String
		$tokenAddress: String
		$anonymous: Boolean
	) {
		saveDonation(
			chainId: $chainId
			fromAddress: $fromAddress
			toAddress: $toAddress
			transactionId: $transactionId
			transactionNetworkId: $transactionNetworkId
			amount: $amount
			token: $token
			projectId: $projectId
			transakId: $transakId
			transakStatus: $transakStatus
			tokenAddress: $tokenAddress
			anonymous: $anonymous
		)
	}
`;

export const CREATE_DONATION = gql`
	mutation (
		$transactionId: String!
		$transactionNetworkId: Float!
		$nonce: Float!
		$amount: Float!
		$token: String!
		$projectId: Float!
		$transakId: String
		$tokenAddress: String
		$anonymous: Boolean
	) {
		createDonation(
			transactionId: $transactionId
			transactionNetworkId: $transactionNetworkId
			nonce: $nonce
			amount: $amount
			token: $token
			projectId: $projectId
			transakId: $transakId
			tokenAddress: $tokenAddress
			anonymous: $anonymous
		)
	}
`;

export const UPDATE_DONATION_STATUS = gql`
	mutation ($status: String!, $donationId: Float!) {
		updateDonationStatus(status: $status, donationId: $donationId) {
			id
			status
			verifyErrorMessage
		}
	}
`;
