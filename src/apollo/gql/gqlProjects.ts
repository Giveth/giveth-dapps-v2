import { gql } from '@apollo/client';

export const PROJECT_CORE_FIELDS = gql`
	fragment ProjectCoreFields on Project {
		__typename
		id
		title
		image
		slug
		verified
		isGivbackEligible
		totalDonations
		projectType
		causeProjects {
			id
			project {
				id
			}
		}
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

export const PROJECT_CARD_FIELDS = gql`
	${PROJECT_CORE_FIELDS}
	fragment ProjectCardFields on Project {
		...ProjectCoreFields
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
		activeProjectsCount
	}
`;

export const PROJECT_CARD_FIELDS_CAUSES = gql`
	${PROJECT_CORE_FIELDS}
	fragment ProjectCardFields on Project {
		...ProjectCoreFields
		descriptionSummary
		categories {
			name
			value
			mainCategory {
				title
			}
		}
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
		status {
			name
		}
	}
`;

export const FETCH_ALL_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchAllProjects(
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

export const FETCH_ALL_PROJECTS_CAUSES = gql`
	${PROJECT_CARD_FIELDS_CAUSES}
	query FetchAllProjects(
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

export const FETCH_PROJECT_BY_SLUG_VERIFICATION = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			status {
				name
			}
			adminUser {
				walletAddress
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_SUCCESS = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			image
			slug
			description
			chainId
			descriptionSummary
			activeProjectsCount
			adminUser {
				id
				name
				walletAddress
				avatar
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_DONATION = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			image
			slug
			descriptionSummary
			verified
			isGivbackEligible
			totalDonations
			sumDonationValueUsdForActiveQfRound
			countUniqueDonorsForActiveQfRound
			projectType
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
			organization {
				label
				supportCustomTokens
				disableRecurringDonations
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
				memo
			}
			status {
				name
			}
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
				minimumValidUsdValue
			}
			anchorContracts {
				address
				isActive
				networkId
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT = gql`
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
			projectType
			causeProjects {
				id
				project {
					id
					title
					image
					slug
					verified
					isGivbackEligible
					totalDonations
					description
					projectType
					descriptionSummary
					adminUser {
						id
						name
						walletAddress
						avatar
					}
				}
			}
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

export const FETCH_PROJECT_BY_ID = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			id
			title
			image
			description
			projects {
				id
				title
				image
				slug
				description
				categories {
					name
					value
					mainCategory {
						title
					}
				}
			}
			loadCauseProjects {
				id
				projectId
				isIncluded
				project {
					id
					title
					image
					slug
					description
					categories {
						name
						value
						mainCategory {
							title
						}
					}
					status {
						name
					}
				}
			}
			addresses {
				address
				memo
				isRecipient
				networkId
				chainType
			}
			socialMedia {
				type
				link
			}
			impactLocation
			categories {
				name
				value
				mainCategory {
					title
				}
			}
			adminUser {
				walletAddress
			}
			status {
				name
			}
			slug
			anchorContracts {
				address
				isActive
				networkId
			}
		}
	}
`;

export const FETCH_GIVETH_PROJECT_BY_ID = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			addresses {
				memo
				address
				isRecipient
				networkId
				chainType
			}
			slug
		}
	}
`;

export const FETCH_PROJECT_REACTION_BY_ID = gql`
	query ProjectById($id: Float!, $connectedWalletUserId: Int) {
		projectById(id: $id, connectedWalletUserId: $connectedWalletUserId) {
			id
			reaction {
				id
				userId
			}
		}
	}
`;

export const FETCH_PROJECT_UPDATES = gql`
	query GetProjectUpdates(
		$projectId: Int!
		$take: Int!
		$skip: Int!
		$connectedWalletUserId: Int
		$orderBy: OrderBy
	) {
		getProjectUpdates(
			projectId: $projectId
			take: $take
			skip: $skip
			connectedWalletUserId: $connectedWalletUserId
			orderBy: $orderBy
		) {
			id
			title
			projectId
			createdAt
			userId
			content
			isMain
			reaction {
				projectUpdateId
				userId
			}
		}
	}
`;

export const FETCH_FEATURED_UPDATE_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query fetchFeaturedProjects(
		$limit: Int
		$skip: Int
		$connectedWalletUserId: Int
	) {
		featuredProjects(
			limit: $limit
			skip: $skip
			connectedWalletUserId: $connectedWalletUserId
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const FETCH_FEATURED_PROJECT_UPDATES = gql`
	query featuredProjectUpdate($projectId: Int!) {
		featuredProjectUpdate(projectId: $projectId) {
			id
			title
			projectId
			userId
			content
			isMain
			createdAt
		}
	}
`;

export const ADD_PROJECT_UPDATE = gql`
	mutation ($projectId: Float!, $title: String!, $content: String!) {
		addProjectUpdate(
			projectId: $projectId
			title: $title
			content: $content
		) {
			id
			projectId
			userId
			content
		}
	}
`;

export const DELETE_PROJECT_UPDATE = gql`
	mutation DeleteProjectUpdate($updateId: Float!) {
		deleteProjectUpdate(updateId: $updateId)
	}
`;

export const EDIT_PROJECT_UPDATE = gql`
	mutation EditProjectUpdate(
		$content: String!
		$title: String!
		$updateId: Float!
	) {
		editProjectUpdate(
			content: $content
			title: $title
			updateId: $updateId
		) {
			id
			title
			projectId
			userId
			content
			createdAt
			isMain
		}
	}
`;

export const FETCH_USER_LIKED_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchUserLikedProjects($take: Int, $skip: Int, $userId: Int!) {
		likedProjectsByUserId(take: $take, skip: $skip, userId: $userId) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const UPLOAD_IMAGE = gql`
	mutation ($imageUpload: ImageUpload!) {
		uploadImage(imageUpload: $imageUpload) {
			url
			projectId
			projectImageId
		}
	}
`;

export const WALLET_ADDRESS_IS_VALID = gql`
	query WalletAddressIsValid(
		$address: String!
		$chainType: ChainType
		$memo: String
	) {
		walletAddressIsValid(
			address: $address
			chainType: $chainType
			memo: $memo
		)
	}
`;

export const CREATE_PROJECT = gql`
	mutation ($project: CreateProjectInput!) {
		createProject(project: $project) {
			id
			title
			description
			adminUserId
			adminUser {
				name
				walletAddress
				avatar
			}
			image
			impactLocation
			slug
			addresses {
				address
				networkId
				chainType
				memo
			}
			categories {
				name
				value
			}
			socialMedia {
				type
				link
			}
		}
	}
`;

export const UPDATE_PROJECT = gql`
	mutation ($projectId: Float!, $newProjectData: UpdateProjectInput!) {
		updateProject(projectId: $projectId, newProjectData: $newProjectData) {
			id
			title
			description
			image
			slug
			creationDate
			adminUserId
			adminUser {
				name
				walletAddress
				avatar
			}
			addresses {
				address
				networkId
				chainType
				memo
			}
			impactLocation
			categories {
				name
				value
			}
			socialMedia {
				type
				link
			}
		}
	}
`;

export const ADD_RECIPIENT_ADDRESS_TO_PROJECT = gql`
	mutation (
		$projectId: Float!
		$networkId: Float!
		$address: String!
		$chainType: ChainType
		$memo: String
	) {
		addRecipientAddressToProject(
			projectId: $projectId
			networkId: $networkId
			address: $address
			chainType: $chainType
			memo: $memo
		) {
			id
			title
			description
			descriptionSummary
			image
			slug
			listed
			reviewStatus
			verified
			isGivbackEligible
			slugHistory
			creationDate
			adminUserId
			walletAddress
			impactLocation
			categories {
				name
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
				memo
			}
			adminUser {
				id
				name
				email
				walletAddress
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
		}
	}
`;

export const LIKE_PROJECT_MUTATION = gql`
	mutation ($projectId: Int!) {
		likeProject(projectId: $projectId) {
			id
			projectId
			reaction
			userId
		}
	}
`;

export const UNLIKE_PROJECT_MUTATION = gql`
	mutation ($reactionId: Int!) {
		unlikeProject(reactionId: $reactionId)
	}
`;

export const GET_STATUS_REASONS = gql`
	query GetStatusReasons($statusId: Int!) {
		getStatusReasons(statusId: $statusId) {
			id
			description
			status {
				id
				name
			}
		}
	}
`;

export const DEACTIVATE_PROJECT = gql`
	mutation ($projectId: Float!, $reasonId: Float) {
		deactivateProject(projectId: $projectId, reasonId: $reasonId)
	}
`;

export const ACTIVATE_PROJECT = gql`
	mutation ($projectId: Float!) {
		activateProject(projectId: $projectId)
	}
`;

export const TITLE_IS_VALID = `
	query IsValidTitleForProject($title: String!, $projectId: Float) {
		isValidTitleForProject(title: $title, projectId: $projectId)
	}
`;

export const PROJECT_ACCEPTED_TOKENS = gql`
	query GetProjectAcceptTokens($projectId: Float!) {
		getProjectAcceptTokens(projectId: $projectId) {
			id
			symbol
			networkId
			chainType
			address
			name
			decimals
			mainnetAddress
			isGivbackEligible
			order
			isStableCoin
			coingeckoId
			isQR
		}
	}
`;

export const CAUSE_ACCEPTED_TOKENS = gql`
	query GetCauseAcceptTokens($causeId: Float!, $networkId: Float!) {
		getCauseAcceptTokens(causeId: $causeId, networkId: $networkId) {
			id
			symbol
			networkId
			chainType
			address
			name
			decimals
			mainnetAddress
			isGivbackEligible
			order
			isStableCoin
			coingeckoId
			isQR
		}
	}
`;

export const SIMILAR_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query SimilarProjectsBySlug($slug: String!, $take: Int, $skip: Int) {
		similarProjectsBySlug(slug: $slug, take: $take, skip: $skip) {
			projects {
				...ProjectCardFields
			}
		}
	}
`;

export const MAIN_CATEGORIES_QUERY = `
	mainCategories {
		title
		banner
		slug
		description
		categories {
			name
			value
			isActive
			canUseOnFrontend
		}
	}
`;

export const FETCH_MAIN_CATEGORIES = gql`
	query {
		${MAIN_CATEGORIES_QUERY}
	}
`;

export const FETCH_RECURRING_DONATIONS_BY_PROJECTID = gql`
	query (
		$take: Int
		$skip: Int
		$projectId: Int!
		$searchTerm: String
		$status: String
		$finishStatus: FinishStatus
		$orderBy: RecurringDonationSortBy
		$includeArchived: Boolean
	) {
		recurringDonationsByProjectId(
			take: $take
			skip: $skip
			projectId: $projectId
			searchTerm: $searchTerm
			status: $status
			finishStatus: $finishStatus
			orderBy: $orderBy
			includeArchived: $includeArchived
		) {
			recurringDonations {
				id
				txHash
				networkId
				currency
				anonymous
				status
				amountStreamed
				totalUsdStreamed
				flowRate
				txHash
				donor {
					id
					walletAddress
					name
					email
					avatar
				}
				createdAt
			}
			totalCount
		}
	}
`;
export const FETCH_RECURRING_DONATIONS_BY_DATE = gql`
	query ($projectId: Int!, $startDate: String, $endDate: String) {
		recurringDonationsByDate(
			projectId: $projectId
			startDate: $startDate
			endDate: $endDate
		) {
			recurringDonations {
				id
				txHash
				networkId
				flowRate
				currency
				anonymous
				isArchived
				status
				totalUsdStreamed
				donor {
					id
					walletAddress
					firstName
					email
				}
				createdAt
			}
			totalCount
		}
	}
`;

export const DELETE_DRAFT_PROJECT = gql`
	mutation ($projectId: Float!) {
		deleteDraftProject(projectId: $projectId)
	}
`;
