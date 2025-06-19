import { gql } from '@apollo/client';
import { PROJECT_CARD_FIELDS } from '@/apollo/gql/gqlProjects';

// Base cause fields that are used in multiple queries
export const CAUSE_BASE_FIELDS = gql`
	fragment CauseBaseFields on Cause {
		id
		title
		description
		chainId
		fundingPoolAddress
		causeId
		depositTxHash
		depositTxChainId
		mainCategory
		subCategories
		status
		statusValue
		listingStatus
		listingStatusValue
		activeProjectsCount
		totalRaised
		totalDistributed
		totalDonated
		createdAt
		updatedAt
	}
`;

// Owner fields fragment
export const CAUSE_OWNER_FIELDS = gql`
	fragment CauseOwnerFields on Cause {
		owner {
			id
			name
			walletAddress
		}
	}
`;

// Projects fields fragment
export const CAUSE_PROJECTS_FIELDS = gql`
	${PROJECT_CARD_FIELDS}
	fragment CauseProjectsFields on Cause {
		projects {
			...ProjectCardFields
		}
	}
`;

// GivPower and ranking fields fragment
export const CAUSE_GIVPOWER_FIELDS = gql`
	fragment CauseGivPowerFields on Cause {
		givpowerRank
		instantBoostingRank
		givPower
		givBack
	}
`;

// Complete cause fields for single cause queries
export const CAUSE_FULL_FIELDS = gql`
	${CAUSE_BASE_FIELDS}
	${CAUSE_OWNER_FIELDS}
	${CAUSE_PROJECTS_FIELDS}
	${CAUSE_GIVPOWER_FIELDS}
	fragment CauseFullFields on Cause {
		...CauseBaseFields
		...CauseOwnerFields
		...CauseProjectsFields
		...CauseGivPowerFields
	}
`;

// Validation query
export const CAUSE_TITLE_IS_VALID = gql`
	query IsValidCauseTitle($title: String!) {
		isValidCauseTitle(title: $title)
	}
`;

// Create cause mutation
export const CREATE_CAUSE = gql`
	${CAUSE_BASE_FIELDS}
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

// Extended fields for cause cards
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
