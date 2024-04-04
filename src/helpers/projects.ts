import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { IMainCategory } from '@/apollo/types/types';

export const getMainCategorySlug = (category?: IMainCategory) =>
	category?.slug === 'all' ? undefined : category?.slug;

export const sortMap = {
	[EProjectsSortBy.MOST_FUNDED.toLowerCase()]: EProjectsSortBy.MOST_FUNDED,
	[EProjectsSortBy.MOST_LIKED.toLowerCase()]: EProjectsSortBy.MOST_LIKED,
	[EProjectsSortBy.NEWEST.toLowerCase()]: EProjectsSortBy.NEWEST,
	[EProjectsSortBy.OLDEST.toLowerCase()]: EProjectsSortBy.OLDEST,
	[EProjectsSortBy.QUALITY_SCORE.toLowerCase()]:
		EProjectsSortBy.QUALITY_SCORE,
	[EProjectsSortBy.INSTANT_BOOSTING.toLowerCase()]:
		EProjectsSortBy.INSTANT_BOOSTING,
	[EProjectsSortBy.GIVPOWER.toLowerCase()]: EProjectsSortBy.GIVPOWER,
	[EProjectsSortBy.RECENTLY_UPDATED.toLowerCase()]:
		EProjectsSortBy.RECENTLY_UPDATED,
	[EProjectsSortBy.ActiveQfRoundRaisedFunds.toLowerCase()]:
		EProjectsSortBy.ActiveQfRoundRaisedFunds,
	[EProjectsSortBy.EstimatedMatching.toLowerCase()]:
		EProjectsSortBy.EstimatedMatching,
};
