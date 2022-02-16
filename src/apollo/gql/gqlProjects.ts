import { gql } from '@apollo/client';

export const FETCH_HOME_PROJECTS = gql`
	query FetchAllProjects($limit: Int, $orderBy: OrderBy) {
		projects(take: $limit, orderBy: $orderBy) {
			projects {
				id
				title
				image
				slug
				description
				verified
				totalDonations
				traceCampaignId
				reaction {
					userId
				}
				adminUser {
					name
				}
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
	) {
		projects(
			take: $limit
			skip: $skip
			orderBy: $orderBy
			filterBy: $filterBy
			searchTerm: $searchTerm
			category: $category
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
				reaction {
					userId
				}
				adminUser {
					name
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
	query ProjectBySlug($slug: String!) {
		projectBySlug(slug: $slug) {
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
			creationDate
			givingBlocksId
			reaction {
				userId
			}
			traceCampaignId
			categories {
				name
			}
			adminUser {
				name
				walletAddress
			}
			status {
				id
				name
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
	) {
		getProjectUpdates(
			projectId: $projectId
			take: $take
			skip: $skip
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			projectId
			userId
			content
			isMain
			totalReactions
			reaction {
				projectUpdateId
			}
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

export const ADD_PROJECT = gql`
	mutation ($project: ProjectInput!) {
		addProject(project: $project) {
			id
			title
			description
			admin
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

export const LIKE_PROJECT_QUERY = `
  mutation ($projectId: Int!) {
    likeProject(projectId: $projectId) {
      id
      projectId
      reaction
    }
  }
`;

export const UNLIKE_PROJECT_QUERY = `
  mutation ($reactionId: Int!) {
    unlikeProject(reactionId: $reactionId)
  }
`;

export const LIKE_PROJECT_UPDATE_QUERY = `
  mutation ($projectUpdateId: Int!) {
    likeProjectUpdate(projectUpdateId: $projectUpdateId) {
      id
      projectUpdateId
      reaction
    }
  }
`;

export const UNLIKE_PROJECT_UPDATE_QUERY = `
  mutation ($reactionId: Int!) {
    unlikeProjectUpdate(reactionId: $reactionId)
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
