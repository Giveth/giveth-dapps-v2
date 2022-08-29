interface INotificationCountState {
	general: number;
	givEconomyRelated: number;
	projectsRelated: number;
	lastNotificationId: string;
	total: number;
}

export interface INotificationCountResult {
	result: INotificationCountState;
}
