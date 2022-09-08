import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import { isUserRegistered } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
	setShowWelcomeModal,
} from '@/features/modal/modal.slice';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import CompleteProfile from '@/components/CompleteProfile';
import Spinner from '@/components/Spinner';

const CreateIndex = () => {
	const dispatch = useAppDispatch();
	const {
		isLoading,
		isEnabled,
		isSignedIn,
		userData: user,
	} = useAppSelector(state => state.user);
	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			if (!isRegistered && isSignedIn) {
				dispatch(setShowCompleteProfile(true));
			}
		} else {
			if (!isLoading) dispatch(setShowWelcomeModal(true));
		}
	}, [user, isSignedIn, isLoading]);

	if (isLoading) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (!isRegistered) {
		return <CompleteProfile />;
	}
	return <CreateProject />;
};

export default CreateIndex;
