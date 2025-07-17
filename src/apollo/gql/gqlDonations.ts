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
			recurringDonationsCount
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
		$draftDonationId: Float
		$useDonationBox: Boolean
		$relevantDonationTxHash: String
		$swapData: SwapTransactionInput
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
			draftDonationId: $draftDonationId
			useDonationBox: $useDonationBox
			relevantDonationTxHash: $relevantDonationTxHash
			swapData: $swapData
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
		$toAddress: String
		$anonymous: Boolean
		$referrerId: String
		$safeTransactionId: String
		$useDonationBox: Boolean
		$relevantDonationTxHash: String
		$toWalletMemo: String
		$qrCodeDataUrl: String
		$isQRDonation: Boolean
	) {
		createDraftDonation(
			networkId: $networkId
			amount: $amount
			token: $token
			projectId: $projectId
			toAddress: $toAddress
			tokenAddress: $tokenAddress
			anonymous: $anonymous
			referrerId: $referrerId
			safeTransactionId: $safeTransactionId
			useDonationBox: $useDonationBox
			relevantDonationTxHash: $relevantDonationTxHash
			toWalletMemo: $toWalletMemo
			qrCodeDataUrl: $qrCodeDataUrl
			isQRDonation: $isQRDonation
		)
	}
`;

export const FETCH_DRAFT_DONATION = gql`
	query GetDraftDonationById($id: Int!) {
		getDraftDonationById(id: $id) {
			id
			networkId
			chainType
			status
			toWalletAddress
			fromWalletAddress
			tokenAddress
			currency
			amount
			createdAt
			matchedDonationId
			qrCodeDataUrl
			toWalletMemo
			projectId
			expiresAt
		}
	}
`;

export const MARK_DRAFT_DONATION_AS_FAILED = gql`
	mutation ($id: Int!) {
		markDraftDonationAsFailed(id: $id)
	}
`;

export const FETCH_DONATION_BY_ID = gql`
	${DONATION_CORE_FIELDS}
	query GetDonationById($id: Int!) {
		getDonationById(id: $id) {
			...DonationCoreFields
			isTokenEligibleForGivback
			fromWalletAddress
		}
	}
`;

export const VERIFY_QR_DONATION_TRANSACTION = gql`
	query VerifyQRDonationTransaction($id: Int!) {
		verifyQRDonationTransaction(id: $id) {
			id
			networkId
			chainType
			status
			toWalletAddress
			fromWalletAddress
			tokenAddress
			currency
			amount
			createdAt
			matchedDonationId
			qrCodeDataUrl
			toWalletMemo
			projectId
			expiresAt
		}
	}
`;

export const RENEW_DRAFT_DONATION_EXPIRATION = gql`
	mutation ($id: Int!) {
		renewDraftDonationExpirationDate(id: $id) {
			expiresAt
		}
	}
`;
