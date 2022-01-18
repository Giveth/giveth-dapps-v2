const MyAccount = '/account';

const Routes = {
	Home: '/',
	CreateProject: '/create',
	Projects: '/projects',
	Project: '/project',
	Donate: `/donate/${
		process.env.NEXT_PUBLIC_ENVIRONMENT === 'develop'
			? 'giveth-2021:-retreat-to-the-future'
			: 'the-giveth-community-of-makers'
	}`,
	AboutUs: '/about',
	Faq: '/faq',
	Support: '/support',
	Join: '/join',
	Terms: '/terms',
	Partnerships: '/partnerships',
	MyAccount,
	MyProjects: MyAccount + '/projects',
	MyDonations: MyAccount + '/donations',
};

export default Routes;
