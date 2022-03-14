import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';

const CreateIndex = () => {
	const {
		state: { user, isSignedIn, isEnabled },
		actions: { showCompleteProfile, showSignModal, showSignInModal },
	} = useUser();
	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			showSignInModal(false);
			if (!isRegistered) {
				showCompleteProfile();
				return;
			}
			if (!isSignedIn) {
				showSignModal();
			}
		} else {
			showSignInModal(true);
		}
	}, [user, isSignedIn]);

	return isRegistered && isSignedIn ? <CreateProject /> : null;
};

export default CreateIndex;
