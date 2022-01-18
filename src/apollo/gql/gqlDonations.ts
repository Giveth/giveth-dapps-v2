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
