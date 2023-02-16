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
	let params = new URLSearchParams('');
	if (campaign.type === ECampaignType.SORT_FIELD)
		params.append('sort', campaign.sortingField);

	if (campaign.type === ECampaignType.FILTER_FIELDS) {
		campaign.filterFields.forEach(filter => {
			switch (filter) {
				case ECampaignFilterField.Verified:
					params.append('filter', EProjectsFilter.VERIFIED);
					break;
				case ECampaignFilterField.GivingBlock:
					params.append('filter', EProjectsFilter.GIVING_BLOCK);
					break;
				case ECampaignFilterField.AcceptFundOnGnosis:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_GNOSIS,
					);
					break;
				case ECampaignFilterField.AcceptFundOnGnosis:
					params.append(
						'filter',
						EProjectsFilter.ACCEPT_FUND_ON_GNOSIS,
					);
					break;
				case ECampaignFilterField.BoostedWithGivPower:
					params.append(
						'filter',
						EProjectsFilter.BOOSTED_WITH_GIVPOWER,
					);
					break;
				default:
					break;
			}
		});
	}

	const query = params.toString();
	return `${Routes.Projects}${query ? `?${query}` : ''}`;
}
