import { EDirection, gqlEnums } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		orderBy: { field: gqlEnums.GIVPOWER, direction: EDirection.DESC },
	},
	notifyOnNetworkStatusChange: true,
};
