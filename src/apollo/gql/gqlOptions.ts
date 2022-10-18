import { EDirection, ESortby } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		orderBy: {
			field: ESortby.GIVPOWER,
			direction: EDirection.DESC,
		},
	},
	notifyOnNetworkStatusChange: true,
};
