import { EDirection, gqlEnums } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		orderBy: { field: gqlEnums.QUALITYSCORE, direction: EDirection.DESC },
	},
};
