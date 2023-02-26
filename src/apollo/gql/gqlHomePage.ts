import { gql } from '@apollo/client';

export const HOMEPAGE_DATA = gql`
	query (
		$take: Int
		$takeLatestUpdates: Int
		$skipLatestUpdates: Int
		$fromDate: String
		$toDate: String
	) {
		recentDonations(take: $take) {
			createdAt
			id
			user {
				walletAddress
			}
			project {
				title
				slug
			}
			valueUsd
		}
		projectsPerDate(fromDate: $fromDate, toDate: $toDate) {
			total
		}
		totalDonorsCountPerDate(fromDate: $fromDate, toDate: $toDate) {
			total
		}
		donationsTotalUsdPerDate(fromDate: $fromDate, toDate: $toDate) {
			total
		}
		projectUpdates(take: $takeLatestUpdates, skip: $skipLatestUpdates) {
			projectUpdates {
				id
				title
				projectId
				userId
				contentSummary
				isMain
				totalReactions
				createdAt
				reaction {
					id
					userId
					reaction
					projectUpdateId
				}
				project {
					slug
					image
				}
			}
			count
		}
		campaigns {
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
				descriptionSummary
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
