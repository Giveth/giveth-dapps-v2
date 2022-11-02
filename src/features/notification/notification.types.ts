export interface INotificationCountState {
	general: number;
	givEconomyRelated: number;
	projectsRelated: number;
	lastNotificationId: number;
	total: number;
}

export interface IHtmlTemplate {
	type: 'p' | 'b' | 'a' | 'br' | string;
	content: string;
	href?: string;
}

export interface INotification {
	id: number;
	createdAt: string;
	isRead?: boolean;
	metadata: {
		[key: string]: string;
	};
	notificationType: {
		category: string;
		content: string;
		description: string;
		htmlTemplate: IHtmlTemplate[];
	};
}

export interface INotificationsState {
	count: number;
	notifications?: INotification[];
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
