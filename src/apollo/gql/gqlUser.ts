export const GET_USER_BY_ADDRESS = `
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
			likedProjectsCount
			projectsCount
			donationsCount
		}
	}
`;

export const FETCH_USER_PROJECTS = `
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
				totalDonations
				totalReactions
				verified
				status {
					id
					name
				}
				categories {
					name
				}
				qualityScore
			}
			totalCount
		}
	}
`;

export const FETCH_USER_DONATIONS = `
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
				status
			}
			totalCount
		}
	}
`;

export const UPLOAD_PROFILE_PHOTO = `
	mutation ($fileUpload: FileUploadInputType!) {
		upload(fileUpload: $fileUpload)
	}
`;

export const UPDATE_USER = `
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
