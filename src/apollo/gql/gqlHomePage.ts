import { gql } from '@apollo/client';

export const HOMEPAGE_DATA = gql`
	query (
		$take: Int
		$fromDate: String
		$toDate: String
		$limit: Int
		$sortingBy: SortingField
	) {
		recentDonations(take: $take) {
			createdAt
			id
			user {
				walletAddress
			}
			project {
				title
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
		allProjects(limit: $limit, sortingBy: $sortingBy) {
			projects {
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
			totalCount
		}
	}
`;
