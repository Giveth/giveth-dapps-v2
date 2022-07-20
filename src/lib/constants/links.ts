// Just for external links
import { isProduction } from '@/configuration';
import Routes from '@/lib/constants/Routes';

const DOCS = 'https://docs.giveth.io/';
const DISCOURSE = 'https://forum.giveth.io/';
const TYPEFORM = 'https://giveth.typeform.com/';

const links = {
	REPORT_ISSUE: TYPEFORM + 'issue-bug',
	ASK_QUESTION: TYPEFORM + 'question',
	FEATURE_REQUEST: TYPEFORM + 'featurerequest',
	FEEDBACK: TYPEFORM + 'feedback',
	SUPPORT_US: Routes.Donate + '/the-giveth-community-of-makers',
	PROJECT_VERIFICATION: TYPEFORM + 'verification',
	DISCORD: 'https://discord.giveth.io',
	DISCOURSE,
	GIVBACK_TOKENS_FORUM: DISCOURSE + 't/givbacks-token-list/253',
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
	NICE_DOC: DOCS + 'giveconomy/niceToken',
	USER_DOCS: DOCS + 'dapps/',
	DEVELOPER_DOCS: DOCS + 'dapps/givethioinstallation',
	CAMPAIGN_DOCS: DOCS + 'dapps/entitiesAndRoles/#campaigns',
	TRACES_DOCS: DOCS + 'dapps/entitiesAndRoles/#traces',
	MAKE_TRACEABLE_DOCS: DOCS + 'dapps/makeTraceableProject',
	VERIFICATION_DOCS: DOCS + 'dapps/projectVerification',
	FUNDRAISING_DOCS: DOCS + 'whatisgiveth/fundraisingGuide',
	TRACE: 'https://trace.giveth.io/',
	COMMONS_STACK: 'https://commonsstack.org/',
	RECRUITEE: 'https://giveth.recruitee.com/',
	JOINGIVFRENS: TYPEFORM + 'regenfarms',
	HISTORY: DOCS + 'whatisgiveth/history',
	DISCORD_SUPPORT: 'https://discord.gg/TeWHtAjNQT',
	CALENDAR:
		'https://calendar.google.com/calendar/u/1?cid=Z2l2ZXRoZG90aW9AZ21haWwuY29t',
	ADD_TO_CALENDAR:
		'https://calendar.google.com/event?action=TEMPLATE&tmeid=dWZydnNoNjVmb2NvNDNrZ2htMmtzaDNydGZfMjAyMjA2MDlUMTUwMDAwWiBnaXZldGhkb3Rpb0Bt&tmsrc=givethdotio%40gmail.com&scp=ALL',
};

if (!isProduction) {
	links.SUPPORT_US = Routes.Donate + '/giveth-2021:-retreat-to-the-future';
}

export default links;
