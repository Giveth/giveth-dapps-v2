export interface INotificationCountState {
	general: number;
	givEconomyRelated: number;
	projectsRelated: number;
	lastNotificationId: string;
	total: number;
}

export interface IHtmlTemplate {
	type: string;
	content: string;
	href?: string;
}

export interface INotification {
	createdAt: string;
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
