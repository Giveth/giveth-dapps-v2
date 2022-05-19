import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setIsEnabled,
	setIsSignedIn,
	setToken,
} from '@/features/user/user.slice';
import { isSSRMode } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';

const UserController = () => {
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const token = !isSSRMode ? localStorage.getItem(StorageLabel.TOKEN) : null;
	const isEnabled = useAppSelector(state => state.user.isEnabled);
	const isSignIn = useAppSelector(state => state.user.isSignedIn);
	console.log('UserController', isEnabled, isSignIn);
	useEffect(() => {
		if (account && token) {
			dispatch(setIsEnabled(true));
			dispatch(setIsSignedIn(true));
		} else if (account) {
			dispatch(setIsEnabled(true));
		}
	}, [account, token]);

	useEffect(() => {
		if (token) {
			dispatch(setToken(token));
		}
	}, [token]);

	return null;
};

export default UserController;
