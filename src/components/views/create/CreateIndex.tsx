import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';
import useModal from '@/context/ModalProvider';

const CreateIndex = () => {
	const {
		state: { user, isSignedIn, isEnabled },
	} = useUser();

	const {
		actions: { showWelcomeModal, showSignWithWallet, showCompleteProfile },
	} = useModal();

	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			if (!isRegistered) {
				showCompleteProfile();
				return;
			}
			if (!isSignedIn) {
				showSignWithWallet();
			}
		} else {
			showWelcomeModal();
		}
	}, [user, isSignedIn]);

	return isRegistered && isSignedIn ? <CreateProject /> : null;
};

export default CreateIndex;
