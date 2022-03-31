import { gql } from '@apollo/client';

export const FETCH_HOME_PROJECTS = gql`
	query FetchAllProjects(
		$limit: Int
		$orderBy: OrderBy
		$connectedWalletUserId: Int
	) {
		projects(
			take: $limit
			orderBy: $orderBy
			connectedWalletUserId: $connectedWalletUserId
		) {
			projects {
				id
				title
				image
				slug
				description
				verified
				totalDonations
				traceCampaignId
				givingBlocksId
				reaction {
					id
					userId
				}
				totalReactions
				adminUser {
					name
					walletAddress
				}
				updatedAt
				givingBlocksId
			}
			totalCount
		}
	}
`;

export const FETCH_ALL_PROJECTS = gql`
	query FetchAllProjects(
		$limit: Int
		$skip: Int
		$orderBy: OrderBy
		$filterBy: FilterBy
		$searchTerm: String
		$category: String
		$connectedWalletUserId: Int
	) {
		projects(
			take: $limit
			skip: $skip
			orderBy: $orderBy
			filterBy: $filterBy
			searchTerm: $searchTerm
			category: $category
			connectedWalletUserId: $connectedWalletUserId
		) {
			projects {
				id
				title
				image
				slug
				description
				verified
				totalDonations
				traceCampaignId
				givingBlocksId
				reaction {
					id
					userId
				}
				totalReactions
				adminUser {
					name
					walletAddress
				}
				updatedAt
				organization {
					name
					label
					supportCustomTokens
				}
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
			id
			title
			image
			slug
			description
			verified
			traceCampaignId
			walletAddress
			totalProjectUpdates
			totalDonations
			totalTraceDonations
			creationDate
			givingBlocksId
			reaction {
				id
				userId
			}
			totalReactions
			traceCampaignId
			categories {
				name
			}
			adminUser {
				id
				name
				walletAddress
			}
			status {
				id
				name
			}
			organization {
				name
				label
				supportCustomTokens
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
			walletAddress
			impactLocation
			categories {
				name
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
	query FetchUesrLikedProjects($take: Int, $skip: Int, $userId: Int!) {
		likedProjectsByUserId(take: $take, skip: $skip, userId: $userId) {
			projects {
				id
				title
				balance
				description
				image
				slug
				creationDate
				admin
				walletAddress
				impactLocation
				listed
				givingBlocksId
				totalDonations
				categories {
					name
				}
				reaction {
					id
					userId
				}
				qualityScore
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
			}
			image
			impactLocation
			slug
			walletAddress
			categories {
				name
			}
		}
	}
`;

export const UPDATE_PROJECT = gql`
	mutation ($projectId: Float!, $newProjectData: CreateProjectInput!) {
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
			}
			walletAddress
			impactLocation
			categories {
				name
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

export const TITLE_IS_VALID = gql`
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
		}
	}
`;
