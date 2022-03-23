// Just for external links

import config, { isProduction } from '@/configuration';
import Routes from '@/lib/constants/Routes';

const DOCS = 'https://docs.giveth.io/';

const links: any = {
	BACKEND: config.BACKEND_LINK,
	FRONTEND: 'https://giveth-dapps-v2.vercel.app/',
	REPORT_ISSUE: 'https://github.com/Giveth/giveth-dapps-v2/issues/new',
	ASK_QUESTION: 'https://giveth.typeform.com/question',
	FEATURE_REQUEST: 'https://giveth.typeform.com/featurerequest',
	FEEDBACK: 'https://giveth.typeform.com/feedback',
	PROJECT_VERIFICATION: 'https://giveth.typeform.com/verification',
	DISCORD: 'https://discord.gg/Uq2TaXP9bC',
	DISCOURSE: 'https://forum.giveth.io/',
	GITHUB: 'https://github.com/Giveth/',
	TELEGRAM: 'https://t.me/Givethio',
	MEDIUM: 'https://medium.com/giveth/',
	TWITTER: 'https://twitter.com/Givethio',
	YOUTUBE: 'https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ',
	REDDIT: 'https://reddit.com/r/giveth',
	DOCS,
	GIVBACK_DOC: DOCS + 'giveconomy/givbacks',
	COVENANT_DOC: DOCS + 'whatisgiveth/covenant/',
	GIVETH_DOCS: DOCS + 'whatisgiveth/',
	USER_DOCS: DOCS + 'dapps/',
	DEVELOPER_DOCS: DOCS + 'dapps/givethioinstallation',
	TRACE: 'https://trace.giveth.io/',
	COMMONS_STACK: 'https://commonsstack.org/',
	RECRUITEE: 'https://giveth.recruitee.com/',
	JOINGIVFRENS: 'https://giveth.typeform.com/regenfarms',
};

if (!isProduction) {
	links.SUPPORT_US = Routes.Donate + '/giveth-2021:-retreat-to-the-future';
} else {
	links.FRONTEND = 'https://giveth.io/';
	links.SUPPORT_US = Routes.Donate + '/the-giveth-community-of-makers';
}

export default links;
