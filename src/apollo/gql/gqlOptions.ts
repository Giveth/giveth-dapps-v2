import { IS_BOOSTING_ENABLED } from '@/configuration';
import { EDirection, ESortby } from '../types/gqlEnums';

export const OPTIONS_HOME_PROJECTS = {
	variables: {
		limit: 15,
		skip: 0,
		orderBy: {
			field: IS_BOOSTING_ENABLED
				? ESortby.GIVPOWER
				: ESortby.QUALITYSCORE,
			direction: EDirection.DESC,
		},
	},
	notifyOnNetworkStatusChange: true,
};
