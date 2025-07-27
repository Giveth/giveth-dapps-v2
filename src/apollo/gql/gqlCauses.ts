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

export const UPDATE_CAUSE = gql`
	mutation UpdateCause(
		$projectId: Float!
		$newProjectData: UpdateProjectInput!
	) {
		updateCause(projectId: $projectId, newProjectData: $newProjectData) {
			id
			title
			description
			image
			slug
			updatedAt
			adminUserId
			walletAddress
			categories {
				name
				mainCategory {
					title
					slug
					banner
					description
				}
			}
			projects {
				id
				title
				slug
			}
			adminUser {
				id
				name
				email
				walletAddress
				isEmailVerified
			}
			status {
				id
				name
			}
		}
	}
`;
