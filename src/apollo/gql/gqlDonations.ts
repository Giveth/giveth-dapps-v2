import { gql } from '@apollo/client';

export const DONATION_CORE_FIELDS = gql`
	fragment DonationCoreFields on Donation {
		__typename
		id
		anonymous
		amount
		valueUsd
		currency
		transactionId
		transactionNetworkId
		chainType
		createdAt
		donationType
		status
		onramperId
	}
`;

export const FETCH_PROJECT_DONATIONS_COUNT = gql`
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
			totalCount
		}
	}
`;

export const FETCH_PROJECT_DONATIONS = gql`
	${DONATION_CORE_FIELDS}
	query DonationsByProjectId(
		$take: Int
		$skip: Int
		$traceable: Boolean
		$qfRoundId: Int
		$projectId: Int!
		$searchTerm: String
		$orderBy: SortBy
		$status: String
	) {
		donationsByProjectId(
			take: $take
			skip: $skip
			traceable: $traceable
			qfRoundId: $qfRoundId
			projectId: $projectId
			searchTerm: $searchTerm
			orderBy: $orderBy
			status: $status
		) {
			donations {
				...DonationCoreFields
				user {
					name
					walletAddress
					avatar
				}
			}
			totalCount
			totalUsdBalance
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
		$transactionId: String
		$transactionNetworkId: Float!
		$nonce: Float
		$amount: Float!
		$token: String!
		$projectId: Float!
		$transakId: String
		$tokenAddress: String
		$anonymous: Boolean
		$referrerId: String
		$safeTransactionId: String
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
			referrerId: $referrerId
			safeTransactionId: $safeTransactionId
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

export const FETCH_QF_ROUND_HISTORY = gql`
	query ($projectId: Int!, $qfRoundId: Int!) {
		getQfRoundHistory(projectId: $projectId, qfRoundId: $qfRoundId) {
			uniqueDonors
			raisedFundInUsd
			donationsCount
			matchingFund
			distributedFundNetwork
			distributedFundTxHash
			estimatedMatching {
				projectDonationsSqrtRootSum
				allProjectsSum
				matchingPool
			}
		}
	}
`;

export const CREATE_DRAFT_DONATION = gql`
	mutation (
		$networkId: Float!
		$amount: Float!
		$token: String!
		$projectId: Float!
		$tokenAddress: String
		$anonymous: Boolean
		$referrerId: String
		$safeTransactionId: String
	) {
		createDraftDonation(
			networkId: $networkId
			amount: $amount
			token: $token
			projectId: $projectId
			tokenAddress: $tokenAddress
			anonymous: $anonymous
			referrerId: $referrerId
			safeTransactionId: $safeTransactionId
		)
	}
`;
