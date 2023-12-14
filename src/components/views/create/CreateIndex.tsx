import React, { useEffect } from 'react';
import CreateProject from '@/components/views/create/CreateProject';
import { isUserRegistered } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
} from '@/features/modal/modal.slice';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import CompleteProfile from '@/components/CompleteProfile';
import { WrappedSpinner } from '@/components/Spinner';
import { useAuthenticationWallet } from '@/hooks/useAuthenticationWallet';

const CreateIndex = () => {
	const dispatch = useAppDispatch();
	const {
		isLoading,
		isEnabled,
		isSignedIn,
		userData: user,
	} = useAppSelector(state => state.user);
	const { openWalletConnectModal } = useAuthenticationWallet();
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
			if (!isLoading) openWalletConnectModal();
		}
	}, [user, isSignedIn, isLoading]);

	if (isLoading) {
		return <WrappedSpinner />;
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
