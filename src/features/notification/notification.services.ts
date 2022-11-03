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

interface INotificationSettingsPutBody {
	id: number;
	allowEmailNotification?: string;
	allowDappPushNotification?: string;
}

export const putNotificationSettings: TPutNotificationSettings = async i => {
	const { id, allowEmailNotification, allowDappPushNotification } = i;

	const body: INotificationSettingsPutBody = { id };
	if (allowEmailNotification !== undefined) {
		body.allowEmailNotification = String(allowEmailNotification);
	}
	if (allowDappPushNotification !== undefined) {
		body.allowDappPushNotification = String(allowDappPushNotification);
	}

	try {
		return await putRequest(
			`${config.MICROSERVICES.notificationSettings}/${id}`,
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
	const data: Promise<INotificationsState> = await getRequest(
		`${config.MICROSERVICES.notification}`,
		true,
		query,
		undefined,
		additionalOptions,
	);
	return data;
};
