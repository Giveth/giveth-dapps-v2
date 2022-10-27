import { captureException } from '@sentry/nextjs';
import { getRequest, postRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import config from '@/configuration';
import { showToastError } from '@/lib/helpers';
import {
	INotificationSetting,
	INotificationSettings,
} from './notification.types';
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

export interface INotificationSettingsPostInput {
	notificationTypeId: number;
	allowEmailNotification?: boolean;
	allowDappPushNotification?: boolean;
}

type TPostNotificationSettings = (
	i: INotificationSettingsPostInput,
) => Promise<INotificationSetting | null>;

export const postNotificationSettings: TPostNotificationSettings = async i => {
	const {
		notificationTypeId,
		allowEmailNotification,
		allowDappPushNotification,
	} = i;

	try {
		return await postRequest(
			`${config.MICROSERVICES.notificationSettings}/${notificationTypeId}`,
			true,
			{
				id: notificationTypeId,
				allowEmailNotification,
				allowDappPushNotification,
			},
		);
	} catch (e) {
		showToastError(e);
		captureException(e, {
			tags: {
				section: 'postNotificationSettings',
			},
		});
		return null;
	}
};

export const fetchNotificationsData = async () => {
	const data = await getRequest(`${config.MICROSERVICES.notification}`, true);
	return data;
};
