import { gql } from '@apollo/client';
import { PROJECT_CARD_FIELDS } from './gqlProjects';

export const CAMPAIGN_CORE_FIELDS = gql`
	${PROJECT_CARD_FIELDS}
	fragment CampaignCoreFields on Campaign {
		__typename
		id
		title
		hashtags
		slug
		isFeatured
		isNew
		description
		relatedProjects {
			...ProjectCardFields
		}
		relatedProjectsCount
		photo
		video
		videoPreview
		type
		isActive
		order
		landingLink
		filterFields
		sortingField
		createdAt
		updatedAt
	}
`;

export const FETCH_CAMPAIGNS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchCampaigns($connectedWalletUserId: Int) {
		campaigns(connectedWalletUserId: $connectedWalletUserId) {
			...CampaignCoreFields
		}
	}
`;

export const FETCH_CAMPAIGN_BY_SLUG = gql`
	${CAMPAIGN_CORE_FIELDS}
	query FetchCampaignBySlug($slug: String, $connectedWalletUserId: Int) {
		findCampaignBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			...CampaignCoreFields
		}
	}
`;
