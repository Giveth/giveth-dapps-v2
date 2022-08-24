const MyAccount = '/account';
const GIVstream = '/givstream';

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
	MyProjects: MyAccount + '?tab=projects',
	MyDonations: MyAccount + '?tab=donations',
	Onboard: '/onboard',
	Verification: '/verification',
	Notification: '/notification',
	GIVECONOMY: '/giveconomy',
	GIVgarden: '/givgarden',
	GIVfarm: '/givfarm',
	GIVstream,
	GIVstream_FlowRate: GIVstream + '#flowRate',
	GIVbacks: '/givbacks',
	Claim: '/claim',
	GivethProject: '/project/the-giveth-community-of-makers',
};

export default Routes;
