import {
	ECampaignFilterField,
	ECampaignType,
	EProjectsFilter,
	ICampaign,
} from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';

export function campaignLinkGenerator(campaign: ICampaign) {
	if (
		campaign.type === ECampaignType.WITHOUT_PROJECTS ||
		campaign.landingLink
	)
		return campaign.landingLink;
	if (campaign.type === ECampaignType.MANUALLY_SELECTED)
		return `${Routes.Projects}?campaign=${campaign.slug}`;
	if (campaign.type === ECampaignType.SORT_FIELD)
		return `${Routes.Projects}?sort=${campaign.sortingField}`;
	if (campaign.type === ECampaignType.FILTER_FIELDS) {
		let filter = '';
		switch (campaign.filterFields) {
			case ECampaignFilterField.Verified:
				filter = EProjectsFilter.VERIFIED;
				break;
			case ECampaignFilterField.GivingBlock:
				filter = EProjectsFilter.GIVING_BLOCK;
				break;
			case ECampaignFilterField.AcceptFundOnGnosis:
				filter = EProjectsFilter.ACCEPT_FUND_ON_GNOSIS;
				break;
			case ECampaignFilterField.AcceptFundOnGnosis:
				filter = EProjectsFilter.ACCEPT_FUND_ON_GNOSIS;
				break;
			case ECampaignFilterField.BoostedWithGivPower:
				filter = EProjectsFilter.BOOSTED_WITH_GIVPOWER;
				break;
			default:
				break;
		}
		return `${Routes.Projects}?filter=${filter}`;
	}
	return '';
}
