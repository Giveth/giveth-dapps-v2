import Routes from '@/lib/constants/Routes';

export const slugToProjectView = (slug: string) => {
	return Routes.Project + '/' + slug;
};

export const slugToSuccessView = (slug: string) => {
	return Routes.Success + '/' + slug;
};

export const slugToSuccessCauseView = (slug: string) => {
	return Routes.CreateCause + '/success/' + slug;
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

export const idToCauseEdit = (id?: string) => {
	return Routes.Cause + '/' + id + '/edit';
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
export const slugToCauseView = (slug: string): string => `/cause/${slug}`;
