// Just for external links
import config, { isProduction } from '@/configuration';
import Routes from '@/lib/constants/Routes';

const DOCS = 'https://docs.giveth.io/';
const DISCOURSE = 'https://forum.giveth.io/';

const links: any = {
	BACKEND: config.BACKEND_LINK,
	FRONTEND: 'https://giveth.io/',
	REPORT_ISSUE: 'https://github.com/Giveth/giveth-dapps-v2/issues/new',
	ASK_QUESTION: 'https://giveth.typeform.com/question',
	FEATURE_REQUEST: 'https://giveth.typeform.com/featurerequest',
	FEEDBACK: 'https://giveth.typeform.com/feedback',
	PROJECT_VERIFICATION: 'https://giveth.typeform.com/verification',
	DISCORD: 'https://discord.giveth.io',
	DISCOURSE,
	GIVBACK_TOKENS_FORUM: 'https://forum.giveth.io/t/givbacks-token-list/253',
	GITHUB: 'https://github.com/Giveth/',
	TELEGRAM: 'https://t.me/Givethio',
	MEDIUM: 'https://medium.com/giveth/',
	TWITTER: 'https://twitter.com/Givethio',
	YOUTUBE: 'https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ',
	REDDIT: 'https://reddit.com/r/giveth',
	DOCS,
	GIVFARM_DOCS: DOCS + 'giveconomy/givfarm',
	GIVSTREAM_DOCS: DOCS + 'giveconomy/givstream',
	GIVBACK_DOC: DOCS + 'giveconomy/givbacks',
	COVENANT_DOC: DOCS + 'whatisgiveth/covenant/',
	GIVETH_DOCS: DOCS + 'whatisgiveth/',
	USER_DOCS: DOCS + 'dapps/',
	DEVELOPER_DOCS: DOCS + 'dapps/givethioinstallation',
	CAMPAIGN_DOCS: DOCS + 'dapps/entitiesAndRoles/#campaigns',
	TRACES_DOCS: DOCS + 'dapps/entitiesAndRoles/#traces',
	MAKE_TRACEABLE_DOCS: DOCS + 'dapps/makeTraceableProject',
	TRACE: 'https://trace.giveth.io/',
	COMMONS_STACK: 'https://commonsstack.org/',
	RECRUITEE: 'https://giveth.recruitee.com/',
	JOINGIVFRENS: 'https://giveth.typeform.com/regenfarms',
	HISTORY: 'https://docs.giveth.io/whatisgiveth/history',
	DISCORD_SUPPORT: 'https://discord.gg/TeWHtAjNQT',
	CALENDAR:
		'https://calendar.google.com/calendar/u/1?cid=Z2l2ZXRoZG90aW9AZ21haWwuY29t',
	ADD_TO_CALENDAR:
		'https://calendar.google.com/event?action=TEMPLATE&tmeid=dWZydnNoNjVmb2NvNDNrZ2htMmtzaDNydGZfMjAyMjA2MDlUMTUwMDAwWiBnaXZldGhkb3Rpb0Bt&tmsrc=givethdotio%40gmail.com&scp=ALL',
};

if (!isProduction) {
	links.SUPPORT_US = Routes.Donate + '/giveth-2021:-retreat-to-the-future';
} else {
	links.SUPPORT_US = Routes.Donate + '/the-giveth-community-of-makers';
}

export default links;
