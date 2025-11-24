/**
 * Type declaration for Twitter Widgets JavaScript API
 * https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization
 */

interface TwitterWidgets {
	createTweet(
		tweetId: string,
		targetElement: HTMLElement | null,
		options?: Record<string, any>,
	): Promise<HTMLElement | undefined>;
	load(targetElement?: HTMLElement): void;
}

interface Window {
	twttr?: {
		widgets: TwitterWidgets;
		ready?: (
			callback: (twttr: { widgets: TwitterWidgets }) => void,
		) => void;
	};
}
