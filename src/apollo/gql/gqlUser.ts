import { gql } from '@apollo/client';
import { DONATION_CORE_FIELDS } from './gqlDonations';
import { PROJECT_CARD_FIELDS } from './gqlProjects';

export const USER_CORE_FIELDS = gql`
	fragment UserCoreFields on UserByAddressResponse {
		__typename
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
`;

export const GET_USER_BY_ADDRESS = gql`
	${USER_CORE_FIELDS}
	query UserByAddress($address: String!) {
		userByAddress(address: $address) {
			...UserCoreFields
			totalDonated
			totalReceived
			likedProjectsCount
			projectsCount
			donationsCount
			boostedProjectsCount
			passportScore
			passportStamps
		}
	}
`;

export const FETCH_USER_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchUserProjects(
		$take: Float
		$skip: Float
		$userId: Int!
		$orderBy: OrderField!
		$direction: OrderDirection!
	) {
		projectsByUserId(
			take: $take
			skip: $skip
			userId: $userId
			orderBy: { field: $orderBy, direction: $direction }
		) {
			projects {
				...ProjectCardFields
				creationDate
				listed
				status {
					id
					name
				}
				addresses {
					address
					isRecipient
					networkId
				}
			}
			totalCount
		}
	}
`;

export const FETCH_USER_DONATIONS = gql`
	${DONATION_CORE_FIELDS}
	query FetchUserDonations(
		$take: Int
		$skip: Int
		$userId: Int!
		$orderBy: SortField!
		$direction: SortDirection!
		$status: String
	) {
		donationsByUserId(
			take: $take
			skip: $skip
			orderBy: { field: $orderBy, direction: $direction }
			userId: $userId
			status: $status
		) {
			donations {
				...DonationCoreFields
				user {
					id
				}
				project {
					id
					title
					slug
				}
				qfRound {
					id
					name
					isActive
				}
				createdAt
				status
				onramperId
			}
			totalCount
		}
	}
`;

export const UPLOAD_PROFILE_PHOTO = gql`
	mutation ($fileUpload: FileUploadInputType!) {
		upload(fileUpload: $fileUpload)
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser(
		$url: String
		$location: String
		$email: String
		$lastName: String
		$firstName: String
		$avatar: String
	) {
		updateUser(
			url: $url
			location: $location
			email: $email
			firstName: $firstName
			lastName: $lastName
			avatar: $avatar
		)
	}
`;

export const VALIDATE_TOKEN = gql`
	query {
		me {
			walletAddress
		}
	}
`;

export const FETCH_USER_GIVPOWER_BY_ADDRESS = `
	query unipoolBalance($id: String!) {
		unipoolBalance(
			id: $id
		) {
			balance
		}
	}
`;

export const FETCH_USERS_GIVPOWER_BY_ADDRESS = `
	query unipoolBalances ($addresses: [String!]!, $contract: String!, $length: Int!) {
	  unipoolBalances(
		first: $length
	  where: {
		unipool:  $contract,
		  user_in: $addresses
	  },
	) {
		balance
		user {
		  id
		}
	  }
	}`;
