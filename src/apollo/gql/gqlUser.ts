import { gql } from '@apollo/client';

export const GET_USER_BY_ADDRESS = gql`
	query UserByAddress($address: String!) {
		userByAddress(address: $address) {
			id
			firstName
			lastName
			name
			email
			avatar
			walletAddress
			url
			location
			totalDonated
			totalReceived
			projectsCount
			donationsCount
		}
	}
`;

export const FETCH_USER_PROJECTS = gql`
	query FetchUserProjects($take: Float, $skip: Float, $userId: Int!) {
		projectsByUserId(take: $take, skip: $skip, userId: $userId) {
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

export const FETCH_USER_DONATIONS = gql`
	query FetchUserProjects(
		$take: Int
		$skip: Int
		$userId: Int!
		$orderBy: SortField!
		$direction: SortDirection!
	) {
		donationsByUserId(
			take: $take
			skip: $skip
			orderBy: { field: $orderBy, direction: $direction }
			userId: $userId
		) {
			donations {
				id
				transactionId
				transactionNetworkId
				toWalletAddress
				fromWalletAddress
				currency
				anonymous
				valueUsd
				amount
				user {
					id
				}
				project {
					id
					title
					slug
				}
				createdAt
			}
			totalCount
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser(
		$url: String
		$name: String!
		$location: String
		$email: String
		$lastName: String
		$firstName: String
	) {
		updateUser(
			url: $url
			name: $name
			location: $location
			email: $email
			firstName: $firstName
			lastName: $lastName
		)
	}
`;
