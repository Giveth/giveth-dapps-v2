import { gql } from '@apollo/client';
import { CAMPAIGN_CORE_FIELDS } from './gqlCampaign';
import { PROJECT_CARD_FIELDS } from './gqlProjects';

export const FETCH_HOMEPAGE_DATA = gql`
	${PROJECT_CARD_FIELDS}
	${CAMPAIGN_CORE_FIELDS}
	query (
		$take: Int
		$takeLatestUpdates: Int
		$skipLatestUpdates: Int
		$fromDate: String
		$toDate: String
		$featuredProjectsLimit: Int
		$featuredProjectsSkip: Int
		$connectedWalletUserId: Int
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
		featuredProjects(
			limit: $featuredProjectsLimit
			skip: $featuredProjectsSkip
			connectedWalletUserId: $connectedWalletUserId
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
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
		campaigns(connectedWalletUserId: $connectedWalletUserId) {
			...CampaignCoreFields
		}
	}
`;
