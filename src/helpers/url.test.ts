/**
 * Robinhood Chain campaign-filter URL mapping (ticket 06).
 *
 * The project filter chip and campaign landing links share one contract:
 * ECampaignFilterField.acceptFundOnRobinhood must map to the GraphQL filter
 * value 'AcceptFundOnRobinhood' in the /projects/all query string. If the
 * switch case in campaignLinkGenerator is dropped the campaign link silently
 * loses its filter — these tests pin the mapping and the enum string.
 */
import { campaignLinkGenerator } from '@/helpers/url';
import {
	ECampaignFilterField,
	ECampaignType,
	EProjectsFilter,
	ICampaign,
} from '@/apollo/types/types';

const baseCampaign: ICampaign = {
	id: '1',
	title: 'Robinhood campaign',
	hashtags: [],
	slug: 'robinhood-campaign',
	isFeatured: false,
	isNew: false,
	description: '',
	relatedProjects: [],
	relatedProjectsCount: 0,
	type: ECampaignType.FILTER_FIELDS,
	isActive: true,
	order: 1,
	landingLink: '',
	filterFields: [],
	sortingField: '' as ICampaign['sortingField'],
	createdAt: '',
	updatedAt: '',
};

describe('campaignLinkGenerator — Robinhood Chain filter', () => {
	it('maps acceptFundOnRobinhood to the GraphQL filter value', () => {
		const link = campaignLinkGenerator({
			...baseCampaign,
			filterFields: [ECampaignFilterField.AcceptFundOnRobinhood],
		});

		expect(link).toBe('/projects/all?filter=AcceptFundOnRobinhood');
	});

	it('keeps the Robinhood filter alongside other filter fields', () => {
		const link = campaignLinkGenerator({
			...baseCampaign,
			filterFields: [
				ECampaignFilterField.Verified,
				ECampaignFilterField.AcceptFundOnRobinhood,
			],
		});

		expect(link).toBe(
			'/projects/all?filter=Verified&filter=AcceptFundOnRobinhood',
		);
	});

	it('pins the frontend filter enum to the backend GraphQL value', () => {
		// The filter chip and the campaign URL must send exactly this string;
		// the backend ProjectResolver.addFiltersQuery matches on it.
		expect(EProjectsFilter.ACCEPT_FUND_ON_ROBINHOOD).toBe(
			'AcceptFundOnRobinhood',
		);
		expect(ECampaignFilterField.AcceptFundOnRobinhood).toBe(
			'acceptFundOnRobinhood',
		);
	});
});
