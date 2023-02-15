import { gql } from '@apollo/client';

export const FETCH_CAMPAIGNS = gql`
	query FetchCampaigns($connectedWalletUserId: Int) {
		campaigns ($connectedWalletUserId: Int) {
			id
			title
			slug
			isFeatured
			description
			relatedProjects {
				id
				title
				image
				slug
				description
				verified
				totalDonations
				traceCampaignId
				reaction {
					id
					userId
				}
				totalReactions
				adminUser {
					name
					walletAddress
				}
				updatedAt
				organization {
					name
					label
					supportCustomTokens
				}
				projectPower {
					powerRank
					totalPower
					round
				}
			}
			relatedProjectsCount
			media
			type
			isActive
			order
			landingLink
			filterFields
			sortingField
			createdAt
			updatedAt
		}
	}
`;
