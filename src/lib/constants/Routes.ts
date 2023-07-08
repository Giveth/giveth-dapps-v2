const MyAccount = '/account';
const GIVstream = '/givstream';
const Notifications = '/notifications';

// Public profile and my account
export const profileTabs = {
	overview: '?tab=overview',
	givpower: '?tab=givpower',
	likedProjects: '?tab=liked',
	projects: '?tab=projects',
	donations: '?tab=donations',
	boosted: '?tab=givpower',
};

export enum ProfileModal {
	PFPModal = 'pfp',
}

const Routes = {
	Home: '/',
	CreateProject: '/create',
	Projects: '/projects',
	QFProjects: '/qf',
	QuadraticFunding: '/qf',
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
	MyAccountSetPfp: MyAccount + `?modal=${ProfileModal.PFPModal}`,
	Onboard: '/onboard',
	Verification: '/verification',
	Notifications,
	NotificationsSettings: Notifications + '/settings',
	GIVeconomy: '/giveconomy',
	GIVgarden: '/givgarden',
	GIVfarm: '/givfarm',
	GIVstream,
	GIVstream_FlowRate: GIVstream + '#flowRate',
	GIVpower: '/givpower',
	GIVbacks: '/givbacks',
	Claim: '/claim',
	GivethProject: '/project/the-giveth-community-of-makers',
	NFT: '/nft',
	NFTMint: '/nft/mint',
	Landing: '/landings',
	HowToBuyXdai: '/how-to-buy-xdai',
	PurchaseXdai: '/purchase-xdai',
	Referral: '/referral',
	Passport: '/passport',
};

export default Routes;
