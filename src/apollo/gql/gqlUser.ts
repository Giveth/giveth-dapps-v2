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
				categories {
					name
				}
				reactions {
					reaction
					id
					projectUpdateId
					userId
				}
				qualityScore
			}
			totalCount
		}
	}
`;
