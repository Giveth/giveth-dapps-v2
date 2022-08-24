import { captureException } from '@sentry/nextjs';
import { getRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import type { INotificationState } from './notification.types';

export const fetchNotificationInfo = async (): Promise<INotificationState> => {
	try {
		return await getRequest('/api/notif');
	} catch (e) {
		console.error('Error on fetchNotificationInfo:', e);
		captureException(e, {
			tags: {
				section: 'fetchNotificationInfo',
			},
		});
		return defaultNotificationValues;
	}
};
