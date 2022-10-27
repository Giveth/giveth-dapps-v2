import { captureException } from '@sentry/nextjs';
import { getRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import config from '@/configuration';
import type { INotificationCountState } from './notification.types';

export const fetchNotificationCount =
	async (): Promise<INotificationCountState> => {
		try {
			return await getRequest(
				`${config.MICROSERVICES.notification}/countUnread`,
				true,
			);
		} catch (e) {
			console.error('Error on fetchNotificationCount:', e);
			captureException(e, {
				tags: {
					section: 'fetchNotificationCount',
				},
			});
			return defaultNotificationValues;
		}
	};

export const fetchNotificationsData = async () => {
	const data = await getRequest(`${config.MICROSERVICES.notification}`, true);
	return data;
};
