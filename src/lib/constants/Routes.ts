const MyAccount = '/account';
const GIVstream = '/givstream';

// Public profile and my account
export const profileTabs = {
	overview: '?tab=overview',
	givpower: '?tab=givpower',
	likedProjects: '?tab=liked',
	projects: '?tab=projects',
	donations: '?tab=donations',
	boosted: '?tab=givpower',
};

const Routes = {
	Home: '/',
	CreateProject: '/create',
	Projects: '/projects',
	Project: '/project',
	Donate: `/donate`,
	User: `/user`,
	AboutUs: '/about',
	Faq: '/faq',
	Support: '/support',
	Join: '/join',
	Terms: '/tos',
	Partnerships: '/partnerships',
	MyAccount,
	MyProjects: MyAccount + profileTabs.projects,
	MyDonations: MyAccount + profileTabs.donations,
	MyBoostedProjects: MyAccount + profileTabs.boosted,
	Onboard: '/onboard',
	Verification: '/verification',
	GIVECONOMY: '/giveconomy',
	GIVgarden: '/givgarden',
	GIVfarm: '/givfarm',
	GIVstream,
	GIVstream_FlowRate: GIVstream + '#flowRate',
	GIVpower: '/givpower',
	GIVbacks: '/givbacks',
	Claim: '/claim',
	GivethProject: '/project/the-giveth-community-of-makers',
	NFT: '/nft',
};

export default Routes;
