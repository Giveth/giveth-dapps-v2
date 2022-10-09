import { IS_BOOSTING_ENABLED } from '@/configuration';
import { EDirection, gqlEnums } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		orderBy: {
			field: IS_BOOSTING_ENABLED
				? gqlEnums.GIVPOWER
				: gqlEnums.QUALITYSCORE,
			direction: EDirection.DESC,
		},
	},
	notifyOnNetworkStatusChange: true,
};
