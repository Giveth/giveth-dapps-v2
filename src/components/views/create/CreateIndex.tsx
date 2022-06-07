import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import { isUserRegistered } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
	setShowWelcomeModal,
} from '@/features/modal/modal.sclie';

const CreateIndex = () => {
	const dispatch = useAppDispatch();
	const {
		isEnabled,
		isSignedIn,
		userData: user,
	} = useAppSelector(state => state.user);
	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			if (!isRegistered) {
				dispatch(setShowCompleteProfile(true));
				return;
			} else {
				dispatch(setShowCompleteProfile(false));
			}
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
			} else {
				dispatch(setShowSignWithWallet(false));
			}
		} else {
			dispatch(setShowWelcomeModal(true));
		}
	}, [user, isSignedIn]);

	return isRegistered && isSignedIn ? <CreateProject /> : null;
};

export default CreateIndex;
