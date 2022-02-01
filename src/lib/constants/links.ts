const links = {
	BACKEND: 'https://serve.giveth.io/graphql',
	FRONTEND:
		process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
			? 'https://giveth-dapps-v2.vercel.app/'
			: 'http://localhost:3000/',
	REPORT_ISSUE: 'https://github.com/Giveth/giveth-io-typescript/issues/new',
	ASK_QUESTION: 'https://giveth.typeform.com/question',
	FEATURE_REQUEST: 'https://giveth.typeform.com/featurerequest',
	FEEDBACK: 'https://giveth.typeform.com/feedback',
	GIVECONOMY: '/giveconomy',
	DISCORD: 'https://discord.gg/Uq2TaXP9bC',
	DISCOURSE: 'https://forum.giveth.io/',
	GITHUB: 'https://github.com/Giveth/',
	TELEGRAM: 'https://t.me/Givethio',
	MEDIUM: 'https://medium.com/giveth/',
	TWITTER: 'https://twitter.com/Givethio',
	YOUTUBE: 'https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ',
	REDDIT: 'https://reddit.com/r/giveth',
	WIKI: 'https://docs.giveth.io/',
};

export default links;
