import Routes from '@/lib/constants/Routes';

export const headerRoutes = [
	{
		title: 'label.home',
		href: Routes.Home,
		desktopOnly: true,
	},
	{
		title: 'label.projects',
		href: Routes.Projects,
		desktopOnly: true,
	},
	{
		title: 'label.giveconomy',
		href: Routes.GIVECONOMY,
		desktopOnly: true,
	},
	{
		title: 'label.community',
		href: Routes.Join,
		desktopOnly: true,
	},
	{
		title: 'label.create_a_project',
		href: Routes.CreateProject,
		desktopOnly: false,
	},
];
