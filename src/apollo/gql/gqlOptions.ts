import { EProjectsSortBy, EProjectType } from '@/apollo/types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
	},
	notifyOnNetworkStatusChange: true,
};

export const OPTIONS_HOME_CAUSES = {
	variables: {
		limit: 15,
		skip: 0,
		sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
		projectType: EProjectType.CAUSE,
	},
	notifyOnNetworkStatusChange: true,
};
