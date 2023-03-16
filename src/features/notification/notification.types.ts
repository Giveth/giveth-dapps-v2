export interface INotificationCountState {
	general: number;
	givEconomyRelated: number;
	projectsRelated: number;
	supportedProjects: number;
	lastNotificationId: number;
	total: number;
}

export interface IHtmlTemplate {
	type: 'p' | 'b' | 'a' | 'br' | string;
	content?: string;
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
		icon: string;
		htmlTemplate: IHtmlTemplate[];
	};
}

export interface INotificationsState {
	count: number;
	notifications?: INotification[];
}

export enum ENotificationCategory {
	general = 'general',
	givEconomy = 'givEconomy',
	projectRelated = 'projectRelated',
	discussion = 'discussion',
	supportedProjects = 'supportedProjects',
}

interface INotificationSettingType {
	category: ENotificationCategory;
	categoryGroup:
		| 'donations'
		| 'stakes'
		| 'yourBoostStatus'
		| 'rewards'
		| 'givPowerAllocations'
		| 'projectBoostStatus'
		| 'projectStatus'
		| 'likedByYouProjects';
	title: string;
	name: string;
	id: number;
	description: string;
	content: string;
	isEmailEditable: boolean;
	isWebEditable: boolean;
}

export interface INotificationSetting {
	notificationTypeId: number;
	id: number;
	allowDappPushNotification: boolean;
	allowEmailNotification: boolean;
	allowNotifications: boolean;
	notificationType?: INotificationSettingType;
	createdAt: string;
	updatedAt: string;
	userAddressId: number;
}

export interface INotificationSettings {
	notificationSettings: INotificationSetting[];
	count: number;
}
