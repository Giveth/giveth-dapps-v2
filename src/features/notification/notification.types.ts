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
