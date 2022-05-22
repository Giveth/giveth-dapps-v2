import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';
import { useAppDispatch } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
	setShowWelcomeModal,
} from '@/features/modal/modal.sclie';

const CreateIndex = () => {
	const dispatch = useAppDispatch();
	const {
		state: { user, isSignedIn, isEnabled },
	} = useUser();

	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			if (!isRegistered) {
				dispatch(setShowCompleteProfile(true));
				return;
			}
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
			}
		} else {
			dispatch(setShowWelcomeModal(true));
		}
	}, [user, isSignedIn]);

	return isRegistered && isSignedIn ? <CreateProject /> : null;
};

export default CreateIndex;
