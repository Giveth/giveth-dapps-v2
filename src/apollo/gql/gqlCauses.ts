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

export const PROJECT_CORE_FIELDS_CAUSES_ALL = gql`
	fragment ProjectCoreFields on Project {
		__typename
		id
		title
		slug
		verified
		isGivbackEligible
		totalDonations
		projectType
		qfRounds {
			id
			name
			isActive
			beginDate
			endDate
		}
	}
`;

export const PROJECT_CARD_FIELDS_CAUSES = gql`
	${PROJECT_CORE_FIELDS_CAUSES_ALL}
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
		verified
		adminUser {
			name
			walletAddress
		}
		organization {
			label
		}
		sumDonationValueUsdForActiveQfRound
		countUniqueDonorsForActiveQfRound
		countUniqueDonors
		estimatedMatching {
			projectDonationsSqrtRootSum
			allProjectsSum
			matchingPool
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

export const FETCH_CAUSE_BY_ID_EDIT = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			id
			title
			image
			description
			causeProjects {
				id
				projectId
				isIncluded
				userRemoved
				project {
					id
					title
					verified
					categories {
						name
						value
						mainCategory {
							title
						}
					}
					addresses {
						id
						networkId
					}
					status {
						name
					}
				}
			}
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
		}
	}
`;

export const FETCH_USER_CAUSES = gql`
	${PROJECT_CARD_FIELDS_CAUSES}
	query FetchUserProjects(
		$take: Float
		$skip: Float
		$userId: Int!
		$orderBy: OrderField!
		$direction: OrderDirection!
		$projectType: String!
	) {
		projectsByUserId(
			take: $take
			skip: $skip
			userId: $userId
			orderBy: { field: $orderBy, direction: $direction }
			projectType: $projectType
		) {
			projects {
				...ProjectCardFields
				creationDate
				listed
				activeProjectsCount
				status {
					id
					name
				}
				totalRaised
				totalDistributed
				addresses {
					address
					memo
					isRecipient
					networkId
					chainType
				}
				causeProjects {
					id
					projectId
					isIncluded
					project {
						id
						verified
						status {
							name
						}
						addresses {
							id
							networkId
						}
					}
				}
			}
			totalCount
		}
	}
`;
