import React, { useEffect, useState } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';
import SignInModal from '@/components/modals/SignInModal';

const CreateIndex = () => {
	const {
		state: { user, isSignedIn },
		actions: { showCompleteProfile, showSignModal },
	} = useUser();
	const userAddress = user?.walletAddress;
	const isRegistered = isUserRegistered(user);

	const [showSigninModal, setShowSigninModal] = useState(false);

	useEffect(() => {
		if (userAddress) {
			showSigninModal && setShowSigninModal(false);
			if (!isRegistered) {
				showCompleteProfile();
				return;
			}
			if (!isSignedIn) {
				showSignModal();
			}
		} else {
			setShowSigninModal(true);
		}
	}, [user, isSignedIn]);

	return (
		<>
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
			{isRegistered && isSignedIn && <CreateProject />}
		</>
	);
};

export default CreateIndex;
