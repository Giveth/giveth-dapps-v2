import { isSSRMode } from '@/lib/helpers';
import { IUser } from '@/apollo/types/types';

export const getUser = (): IUser =>
	!isSSRMode && window.localStorage.getItem(getLocalStorageUserLabel())
		? JSON.parse(
				window.localStorage.getItem(getLocalStorageUserLabel()) || '',
		  )
		: {};

export function setUser(user: IUser, setCookie: any, cookieName: string) {
	setCookie &&
		setCookie(cookieName, JSON.stringify(user), {
			path: '/',
			maxAge: 691200,
			sameSite: true,
		});
	return window.localStorage.setItem(
		getLocalStorageUserLabel(),
		JSON.stringify(user),
	);
}

export const logout = () => {
	if (!isSSRMode) {
		window.localStorage.removeItem(getLocalStorageUserLabel());
		window.localStorage.removeItem('create-form');
		window.localStorage.removeItem('cached-uploaded-imgs');
		// TODO: let's check if we should remove everything or just be careful
		// window.localStorage.clear()
	}
};

export function getLocalStorageUserLabel(): string {
	return process.env.NEXT_PUBLIC_LOCAL_USER_LABEL
		? process.env.NEXT_PUBLIC_LOCAL_USER_LABEL +
				'_' +
				process.env.NEXT_PUBLIC_ENV
		: 'nextUser' + '_' + process.env.NEXT_PUBLIC_ENV;
}
