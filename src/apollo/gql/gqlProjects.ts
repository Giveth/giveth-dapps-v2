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
				reactions {
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
				reactions {
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
			reactions {
				userId
			}
			traceCampaignId
			categories {
				name
			}
			adminUser {
				name
			}
		}
	}
`;

export const FETCH_PROJECT_UPDATES = gql`
	query GetProjectUpdates($projectId: Float!, $take: Float!, $skip: Float!) {
		getProjectUpdates(projectId: $projectId, take: $take, skip: $skip) {
			projectUpdate {
				id
				title
				content
				createdAt
			}
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

export const TITLE_IS_VALID = gql`
	query IsValidTitleForProject($title: String!, $projectId: Float) {
		isValidTitleForProject(title: $title, projectId: $projectId)
	}
`;
