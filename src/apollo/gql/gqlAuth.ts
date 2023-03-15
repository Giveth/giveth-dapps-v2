import { gql } from '@apollo/client';
import { USER_CORE_FIELDS } from './gqlUser';

export const LOGIN_USER = gql`
	${USER_CORE_FIELDS}
	mutation DoLoginWallet(
		$walletAddress: String!
		$signature: String!
		$email: String
		$avatar: String
		$name: String
		$hostname: String!
		$networkId: Float!
	) {
		loginWallet(
			walletAddress: $walletAddress
			signature: $signature
			email: $email
			avatar: $avatar
			name: $name
			hostname: $hostname
			networkId: $networkId
		) {
			token
			user {
				...UserCoreFields
			}
		}
	}
`;
