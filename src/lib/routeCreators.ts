import Routes from '@/lib/constants/Routes';

export const slugToProjectView = (slug: string) => {
	return Routes.Project + '/' + slug;
};

export const slugToCauseView = (slug: string) => {
	return Routes.Cause + '/' + slug;
};

export const slugToSuccessView = (slug: string) => {
	return Routes.Success + '/' + slug;
};

export const slugToProjectDonate = (slug: string, recurring = false) => {
	return Routes.Donate + '/' + slug + (recurring ? '?tab=recurring' : '');
};

export const slugToProjectDonateStellar = (slug: string) => {
	return Routes.Donate + '/' + slug + '?chain=stellar';
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

export const slugToCauseDonate = (slug: string) => {
	return Routes.Donate + '/' + slug + '?cause=true';
};
