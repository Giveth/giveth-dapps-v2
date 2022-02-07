import { gql } from '@apollo/client';

export const FETCH_PROJECT_DONATIONS = gql`
	query DonationsByProjectId($projectId: Float!, $take: Float, $skip: Float) {
		donationsByProjectId(projectId: $projectId, take: $take, skip: $skip) {
			donations {
				id
				anonymous
				user {
					name
				}
				fromWalletAddress
				amount
				valueUsd
				currency
				transactionId
				transactionNetworkId
				createdAt
			}
			totalCount
		}
	}
`;

export const WALLET_DONATIONS = gql`
	query donationsFromWallets($fromWalletAddresses: [String!]!) {
		donationsFromWallets(fromWalletAddresses: $fromWalletAddresses) {
			transactionId
			transactionNetworkId
			toWalletAddress
			fromWalletAddress
			anonymous
			amount
			valueUsd
			valueEth
			priceEth
			priceUsd
			user {
				id
				firstName
				lastName
			}
			project {
				title
			}
			createdAt
			currency
		}
	}
`;
