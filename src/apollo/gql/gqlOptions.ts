import { EProjectsSortBy } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
	},
	notifyOnNetworkStatusChange: true,
};
