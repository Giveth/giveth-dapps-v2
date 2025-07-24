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
			activeQFMBDScore
			ownedCausesCount
			totalCausesDistributed
			totalCausesRaised
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
				projectVerificationForm {
					status
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

export const FETCH_USER_RECURRING_DONATIONS = gql`
	query fetchRecurringDonationsByUserId(
		$take: Int
		$skip: Int
		$status: String
		$orderBy: RecurringDonationSortBy
		$finishStatus: FinishStatus
		$userId: Int!
		$filteredTokens: [String!]
		$includeArchived: Boolean
		$networkId: Int
	) {
		recurringDonationsByUserId(
			take: $take
			skip: $skip
			orderBy: $orderBy
			userId: $userId
			status: $status
			finishStatus: $finishStatus
			filteredTokens: $filteredTokens
			includeArchived: $includeArchived
			networkId: $networkId
		) {
			recurringDonations {
				id
				txHash
				networkId
				flowRate
				currency
				anonymous
				status
				isArchived
				amountStreamed
				totalUsdStreamed
				project {
					id
					title
					slug
					anchorContracts {
						address
						isActive
						networkId
					}
				}
				finished
				createdAt
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
		$newUser: Boolean
	) {
		updateUser(
			url: $url
			location: $location
			email: $email
			firstName: $firstName
			lastName: $lastName
			avatar: $avatar
			newUser: $newUser
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

export const FETCH_USER_STREAMS = `
	query FetchUserStreams($address: String!) {
		streams(
			where: { sender: $address }
		) {
			id
			sender {
				id
			}
			receiver {
				id
			}
			token {
				__typename
				id
				name
				symbol
				decimals
				isSuperToken
				underlyingToken {
					id
					name
					symbol
					decimals
				}
			}
			currentFlowRate
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

export const SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW = gql`
	mutation SendUserEmailConfirmationCodeFlow($email: String!) {
		sendUserEmailConfirmationCodeFlow(email: $email)
	}
`;

export const SEND_USER_CONFIRMATION_CODE_FLOW = gql`
	mutation SendUserConfirmationCodeFlow(
		$verifyCode: String!
		$email: String!
	) {
		sendUserConfirmationCodeFlow(verifyCode: $verifyCode, email: $email)
	}
`;

export const FETCH_ALL_USERS_BASIC_DATA = gql`
	query FetchAllUsersBasicData($limit: Int, $skip: Int) {
		allUsersBasicData(limit: $limit, skip: $skip) {
			users {
				firstName
				lastName
				name
				walletAddress
			}
			totalCount
		}
	}
`;
