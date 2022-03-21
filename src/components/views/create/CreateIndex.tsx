import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';

const CreateIndex = () => {
	const {
		state: { user, isSignedIn, isEnabled },
		actions: { showCompleteProfile, showSignWithWallet, showWelcomeModal },
	} = useUser();
	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			showWelcomeModal(false);
			if (!isRegistered) {
				showCompleteProfile();
				return;
			}
			if (!isSignedIn) {
				showSignWithWallet();
			}
		} else {
			showWelcomeModal(true);
		}
	}, [user, isSignedIn]);

	return isRegistered && isSignedIn ? <CreateProject /> : null;
};

export default CreateIndex;
