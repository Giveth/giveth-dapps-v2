import { gql } from '@apollo/client';
import { PROJECT_CARD_FIELDS } from '@/apollo/gql/gqlProjects';

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

// Fetch cause by ID
export const FETCH_CAUSE_BY_ID_SINGLE_CAUSE = gql`
	${CAUSE_FULL_FIELDS}
	query cause($id: Float!) {
		cause(id: $id) {
			...CauseFullFields
		}
	}
`;

// Fetch cause by slug
export const FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE = gql`
	${CAUSE_FULL_FIELDS}
	query CauseBySlug($slug: String!) {
		causeBySlug(slug: $slug) {
			...CauseFullFields
		}
	}
`;

// Core fields for cause cards
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
			title
			description
			chainId
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

// Fetch all causes (note: this seems to be fetching projects, might need correction)
export const FETCH_ALL_CAUSES = gql`
	${PROJECT_CARD_FIELDS}
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
		$projectType: String
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
			projectType: $projectType
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

// Cause management mutations
export const DEACTIVATE_CAUSE = gql`
	mutation DeactivateCause($causeId: Float!, $reasonId: Float) {
		deactivateCause(causeId: $causeId, reasonId: $reasonId)
	}
`;

export const ACTIVATE_CAUSE = gql`
	mutation ActivateCause($causeId: Float!) {
		activateCause(causeId: $causeId)
	}
`;

export const GET_CAUSE_BY_SLUG = gql`
	query GetCauseBySlug($slug: String!) {
		cause(slug: $slug) {
			id
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
