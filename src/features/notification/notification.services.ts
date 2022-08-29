import { captureException } from '@sentry/nextjs';
import { getRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import config from '@/configuration';
import type { INotificationCountResult } from './notification.types';

export const fetchNotificationCount =
	async (): Promise<INotificationCountResult> => {
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
