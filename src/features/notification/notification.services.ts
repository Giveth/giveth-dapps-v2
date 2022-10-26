import { captureException } from '@sentry/nextjs';
import { getRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import config from '@/configuration';
import { showToastError } from '@/lib/helpers';
import { INotificationSettings } from './notification.types';
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

export const fetchNotificationSettings =
	async (): Promise<INotificationSettings | null> => {
		try {
			return await getRequest(
				`${config.MICROSERVICES.notificationSettings}/?limit=100`,
				true,
			);
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'fetchNotificationSettings',
				},
			});
			return null;
		}
	};
