import Routes from '@/lib/constants/Routes';

export const slugToProjectView = (slug: string) => {
	return Routes.Project + '/' + slug;
};

export const slugToProjectDonate = (slug: string) => {
	return Routes.Donate + '/' + slug;
};

export const idToProjectEdit = (id?: string) => {
	return Routes.Project + '/' + id + '/edit';
};

export const addressToUserView = (address?: string) => {
	return Routes.User + '/' + address;
};

export const slugToVerification = (slug?: string) => {
	return Routes.Verification + '/' + slug;
};
