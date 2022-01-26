const config = {
	PRIMARY_NETWORK: {
		name: 'Mainnet',
		id: 1,
		chain: '0x1',
	},
	SECONDARY_NETWORK: {
		name: 'xDai',
		id: 100,
		chain: '0x64',
	},
	LINKS: {
		BACKEND: 'https://serve.giveth.io/graphql',
		FRONTEND: 'https://giveth.io/',
		REPORT_ISSUE: 'https://github.com/Giveth/giveth-next/issues/new',
		PROJECT_VERIFY: 'https://giveth.typeform.com/verification',
		GIVECONOMY: 'https://giv.giveth.io/',
		DISCORD: 'https://discord.gg/Uq2TaXP9bC',
		DISCOURSE: 'https://forum.giveth.io/',
		GITHUB: 'https://github.com/Giveth/',
		TELEGRAM: 'https://t.me/Givethio',
		MEDIUM: 'https://medium.com/giveth/',
		TWITTER: 'https://twitter.com/Givethio',
		YOUTUBE: 'https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ',
		REDDIT: 'https://reddit.com/r/giveth',
	},
	GIV_TOKEN: {
		MAINNET: '0x900db999074d9277c5da2a43f252d74366230da0',
		XDAI: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
	},
};

if (process.env.NEXT_PUBLIC_ENV === 'develop') {
	config.LINKS.FRONTEND = 'http://localhost:3000/';
	config.PRIMARY_NETWORK = {
		name: 'Ropsten',
		id: 3,
		chain: '0x3',
	};
}

export default config;
