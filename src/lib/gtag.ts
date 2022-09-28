export const GA_TRACKING_ID = 'GTM-K99CFQ7';

interface IGTagEvent {
	action: string;
	category: string;
	label: string;
	value: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
	window.gtag('config', GA_TRACKING_ID, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: IGTagEvent) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
