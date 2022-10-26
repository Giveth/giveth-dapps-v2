export interface INotificationCountState {
	general: number;
	givEconomyRelated: number;
	projectsRelated: number;
	lastNotificationId: string;
	total: number;
}

interface INotificationSettingType {
	category: 'general' | 'givEconomy' | 'projectRelated' | 'discussion';
	title: string;
	name: string;
	id: number;
	description: string;
	content: string;
}

export interface INotificationSetting {
	notificationTypeId: number;
	id: number;
	allowDappPushNotification: boolean;
	allowEmailNotification: boolean;
	allowNotifications: boolean;
	notificationType?: INotificationSettingType;
}

export interface INotificationSettings {
	notificationSettings: INotificationSetting[];
	count: number;
}
