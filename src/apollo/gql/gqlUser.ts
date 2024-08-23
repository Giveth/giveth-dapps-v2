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
		isEmailVerified
		isEmailSent
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
					memo
					isRecipient
					networkId
					chainType
				}
				projectVerificationForm {
					status
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

export const SEND_CODE_TO_CONFIRM_EMAIL = gql`
	mutation sendCodeToConfirmEmail($email: String!) {
		sendUserEmailConfirmationCodeFlow(email: $email)
	}
`;

export const VERIFY_USER_EMAIL_CODE = gql`
	mutation verifyUserEmailCode($code: String!) {
		verifyUserEmailCode(code: $code)
	}
`;

export const CHECK_EMAIL_AVAILABILITY = gql`
	mutation checkEmailAvailability($email: String!) {
		checkEmailAvailability(email: $email)
	}
`;
