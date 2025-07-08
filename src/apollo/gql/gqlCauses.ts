import { gql } from '@apollo/client';

export const CAUSE_TITLE_IS_VALID = `
	query IsValidCauseTitle($title: String!) {
		isValidCauseTitle(title: $title)
	}
`;

// Note: TypeGraphQL uses Float for numbers by default
export const CREATE_CAUSE = gql`
	mutation CreateCause(
		$title: String!
		$description: String!
		$chainId: Float!
		$projectIds: [Float!]!
		$subCategories: [String!]!
		$depositTxHash: String!
		$depositTxChainId: Float!
		$bannerImage: String
	) {
		createCause(
			title: $title
			description: $description
			chainId: $chainId
			projectIds: $projectIds
			subCategories: $subCategories
			depositTxHash: $depositTxHash
			depositTxChainId: $depositTxChainId
			bannerImage: $bannerImage
		) {
			id
			title
			description
			chainId
			walletAddress
			slug
			creationDate
			updatedAt
			categories {
				id
				name
				mainCategory {
					id
					title
					slug
					banner
					description
				}
			}
			status {
				id
				name
			}
			reviewStatus
			totalRaised
			totalDistributed
			totalDonated
			activeProjectsCount
			adminUser {
				id
				walletAddress
				name
			}
			projects {
				id
				title
				slug
			}
		}
	}
`;

export const FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			__typename
			id
			title
			image
			slug
			verified
			isGivbackEligible
			totalDonations
			description
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			socialMedia {
				type
				link
			}
			totalProjectUpdates
			creationDate
			reaction {
				id
				userId
			}
			categories {
				name
				value
				mainCategory {
					title
				}
			}
			adminUser {
				id
				name
				walletAddress
				avatar
			}
			listed
			status {
				id
				name
			}
			organization {
				name
				label
				supportCustomTokens
			}
			verificationFormStatus
			projectPower {
				powerRank
				totalPower
				round
			}
			projectFuturePower {
				totalPower
				powerRank
				round
			}
			givbackFactor
			sumDonationValueUsdForActiveQfRound
			countUniqueDonorsForActiveQfRound
			countUniqueDonors
			estimatedMatching {
				projectDonationsSqrtRootSum
				allProjectsSum
				matchingPool
			}
			qfRounds {
				id
				name
				isActive
				beginDate
				endDate
				eligibleNetworks
				maximumReward
				allocatedTokenSymbol
				allocatedFundUSDPreferred
				allocatedFundUSD
			}
			campaigns {
				id
				title
			}
			anchorContracts {
				address
				isActive
				networkId
			}
		}
	}
`;

export const UPDATE_CAUSE = gql`
	mutation UpdateCause(
		$id: String!
		$title: String!
		$description: String!
		$chainId: Float!
		$projectIds: [Float!]!
		$subCategories: [String!]!
		$depositTxHash: String!
		$depositTxChainId: Float!
		$bannerImage: String
	) {
		updateCause(
			id: $id
			title: $title
			description: $description
			chainId: $chainId
			projectIds: $projectIds
			subCategories: $subCategories
			depositTxHash: $depositTxHash
			depositTxChainId: $depositTxChainId
			bannerImage: $bannerImage
		) {
			id
			title
			description
			chainId
			walletAddress
			slug
			creationDate
			updatedAt
		}
	}
`;
