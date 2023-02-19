import { gql } from '@apollo/client';

export const FETCH_CAMPAIGNS = gql`
	query FetchCampaigns($connectedWalletUserId: Int) {
		campaigns(connectedWalletUserId: $connectedWalletUserId) {
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
			photo
			video
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

export const FETCH_CAMPAIGN_BY_SLUG = gql`
	query FetchCampaignBySlug($slug: String, $connectedWalletUserId: Int) {
		findCampaignBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
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
			hashtags
			photo
			video
			slug
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
