const MyAccount = '/account';

const Routes = {
	Home: '/',
	CreateProject: '/create',
	Projects: '/projects',
	Project: '/project',
	Donate: `/donate`,
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
	GIVECONOMY: '/giveconomy',
	GIVgarden: '/givgarden',
	GIVfarm: '/givfarm',
	GIVstream: '/givstream',
	GIVbacks: '/givbacks',
};

export default Routes;
