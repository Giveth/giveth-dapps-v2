import { gql } from '@apollo/client';

export const PROJECT_CORE_FIELDS = gql`
	fragment ProjectCoreFields on Project {
		__typename
		id
		title
		image
		slug
		verified
		totalDonations
		qfRounds {
			id
			name
			isActive
			beginDate
			endDate
		}
	}
`;

export const PROJECT_CARD_FIELDS = gql`
	${PROJECT_CORE_FIELDS}
	fragment ProjectCardFields on Project {
		...ProjectCoreFields
		descriptionSummary
		totalReactions
		reaction {
			id
			userId
		}
		adminUser {
			name
			walletAddress
			avatar
		}
		updatedAt
		organization {
			label
		}
		projectPower {
			powerRank
			totalPower
			round
		}
		sumDonationValueUsdForActiveQfRound
		sumDonationValueUsd
		countUniqueDonorsForActiveQfRound
		countUniqueDonors
		estimatedMatching {
			projectDonationsSqrtRootSum
			allProjectsSum
			matchingPool
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
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
			categories {
				name
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG = gql`
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
			totalDonations
			description
			addresses {
				address
				isRecipient
				networkId
			}
			totalProjectUpdates
			creationDate
			reaction {
				id
				userId
			}
			totalReactions
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
			projectVerificationForm {
				status
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
			sumDonationValueUsd
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
			addresses {
				address
				isRecipient
				networkId
			}
			impactLocation
			categories {
				name
				value
			}
			adminUser {
				walletAddress
			}
			status {
				name
			}
			slug
		}
	}
`;

export const FETCH_GIVETH_PROJECT_BY_ID = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			addresses {
				address
				isRecipient
				networkId
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
			totalReactions
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
			totalReactions
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
			totalReactions
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
	query WalletAddressIsValid($address: String!) {
		walletAddressIsValid(address: $address)
	}
`;

export const CREATE_PROJECT = gql`
	mutation ($project: CreateProjectInput!) {
		createProject(project: $project) {
			id
			title
			description
			admin
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
			}
			categories {
				name
				value
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
			admin
			adminUser {
				name
				walletAddress
				avatar
			}
			addresses {
				address
				networkId
			}
			impactLocation
			categories {
				name
				value
			}
		}
	}
`;

export const ADD_RECIPIENT_ADDRESS_TO_PROJECT = gql`
	mutation ($projectId: Float!, $networkId: Float!, $address: String!) {
		addRecipientAddressToProject(
			projectId: $projectId
			networkId: $networkId
			address: $address
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
			slugHistory
			creationDate
			admin
			walletAddress
			impactLocation
			categories {
				name
			}
			addresses {
				address
				isRecipient
				networkId
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
	query {
		getStatusReasons(statusId: 6) {
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
			address
			name
			decimals
			mainnetAddress
			isGivbackEligible
			order
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

export const FETCH_MAIN_CATEGORIES = gql`
	query {
		mainCategories {
			title
			banner
			slug
			description
			categories {
				name
				value
				isActive
			}
		}
	}
`;
