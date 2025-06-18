import { gql } from '@apollo/client';
import { PROJECT_CARD_FIELDS } from './gqlProjects';

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
		$mainCategory: String!
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
			mainCategory: $mainCategory
			subCategories: $subCategories
			depositTxHash: $depositTxHash
			depositTxChainId: $depositTxChainId
			bannerImage: $bannerImage
		) {
			id
			title
			description
			chainId
			fundingPoolAddress
			causeId
			mainCategory
			subCategories
			status
			listingStatus
			totalRaised
			totalDistributed
			totalDonated
			activeProjectsCount
			depositTxHash
			depositTxChainId
		}
	}
`;

export const FETCH_CAUSE_BY_ID_SINGLE_CAUSE = gql`
	query cause($id: Float!) {
		cause(id: $id) {
			id
			title
			description
			chainId
			fundingPoolAddress
			causeId
			depositTxHash
			depositTxChainId
			givpowerRank
			instantBoostingRank
			mainCategory
			subCategories
			owner {
				id
				name
				walletAddress
			}
			createdAt
			updatedAt
			status
			statusValue
			listingStatus
			listingStatusValue
			projects {
				id
				title
			}
			activeProjectsCount
			totalRaised
			totalDistributed
			totalDonated
			givPower
			givBack
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

export const CAUSE_CORE_FIELDS = gql`
	fragment CauseCoreFields on Cause {
		__typename
		id
		title
		image
		slug
		verified
		isGivbackEligible
		totalDonations
		qfRounds {
			id
			name
			isActive
			beginDate
			endDate
			maximumReward
			allocatedTokenSymbol
			allocatedFundUSDPreferred
			allocatedFundUSD
			eligibleNetworks
		}
	}
`;

export const CAUSE_CARD_FIELDS = gql`
	${CAUSE_CORE_FIELDS}
	fragment CauseCardFields on Cause {
		...CauseCoreFields
		descriptionSummary
		adminUser {
			name
			walletAddress
			avatar
		}
		updatedAt
		latestUpdateCreationDate
		organization {
			label
		}
		projectPower {
			powerRank
			totalPower
			round
		}
		sumDonationValueUsdForActiveQfRound
		countUniqueDonorsForActiveQfRound
		countUniqueDonors
		estimatedMatching {
			projectDonationsSqrtRootSum
			allProjectsSum
			matchingPool
		}
		anchorContracts {
			address
			isActive
			networkId
		}
	}
`;

export const FETCH_ALL_CAUSES = gql`
	${CAUSE_CARD_FIELDS}
	query FetchAllCauses(
		$limit: Int
		$skip: Int
		$sortingBy: SortingField
		$filters: [FilterField!]
		$searchTerm: String
		$category: String
		$mainCategory: String
		$campaignSlug: String
		$connectedWalletUserId: Int
		$qfRoundSlug: String
	) {
		allProjects(
			limit: $limit
			skip: $skip
			sortingBy: $sortingBy
			filters: $filters
			searchTerm: $searchTerm
			category: $category
			mainCategory: $mainCategory
			campaignSlug: $campaignSlug
			connectedWalletUserId: $connectedWalletUserId
			qfRoundSlug: $qfRoundSlug
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const DEACTIVATE_CAUSE = gql`
	mutation ($causeId: Float!, $reasonId: Float) {
		deactivateCause(causeId: $causeId, reasonId: $reasonId)
	}
`;

export const ACTIVATE_CAUSE = gql`
	mutation ($causeId: Float!) {
		activateCause(causeId: $causeId)
	}
`;
