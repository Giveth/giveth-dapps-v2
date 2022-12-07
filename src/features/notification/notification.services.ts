import { captureException } from '@sentry/nextjs';
import { getRequest, putRequest } from '@/helpers/requests';
import { defaultNotificationValues } from './notification.slice';
import config from '@/configuration';
import { showToastError } from '@/lib/helpers';
import {
	INotificationSetting,
	INotificationSettings,
	INotificationsState,
} from './notification.types';
import type { INotificationCountState } from './notification.types';

export const fetchNotificationCount = async (
	address: string,
): Promise<INotificationCountState> => {
	try {
		return await getRequest(
			`${config.MICROSERVICES.notification}/countUnread/${address}`,
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
				`${config.MICROSERVICES.notificationSettings}`,
				true,
				{ limit: 100 },
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

export interface INotificationSettingsPutInput {
	id: number;
	allowEmailNotification?: boolean;
	allowDappPushNotification?: boolean;
}

type TPutNotificationSettings = (
	i: INotificationSettingsPutInput,
) => Promise<INotificationSetting>;

export const putNotificationSettings: TPutNotificationSettings = async body => {
	try {
		return await putRequest(
			`${config.MICROSERVICES.notificationSettings}/${body.id}`,
			true,
			body,
		);
	} catch (e) {
		showToastError(e);
		captureException(e, {
			tags: {
				section: 'putNotificationSettings',
			},
		});
		throw e;
	}
};

export const fetchNotificationsData = async (
	query: any = {},
	additionalOptions: RequestInit = {},
) => {
	try {
		const data: Promise<INotificationsState> = await getRequest(
			`${config.MICROSERVICES.notification}`,
			true,
			query,
			undefined,
			additionalOptions,
		);
		return data;
	} catch (e) {
		captureException(e, {
			tags: {
				section: 'setNotificationRead',
			},
		});
	}
};

export const setNotificationRead = async (notificationId: number) => {
	try {
		return await putRequest(
			`${config.MICROSERVICES.notification}/read/${notificationId}`,
			true,
		);
	} catch (e) {
		showToastError(e);
		captureException(e, {
			tags: {
				section: 'setNotificationRead',
			},
		});
		return null;
	}
};

export const readAllNotifications = async () => {
	try {
		return await putRequest(
			`${config.MICROSERVICES.notification}/readAll`,
			true,
		);
	} catch (e) {
		showToastError(e);
		captureException(e, {
			tags: {
				section: 'readAllNotifications',
			},
		});
		return null;
	}
};
