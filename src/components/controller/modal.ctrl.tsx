import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WalletModal from '@/components/modals/WalletModal';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { FirstWelcomeModal } from '@/components/modals/FirstWelcomeModal';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowWelcomeModal,
	setShowFirstWelcomeModal,
	setShowWalletModal,
	setShowSignWithWallet,
} from '@/features/modal/modal.slice';
import { isUserRegistered } from '@/lib/helpers';

const ModalController = () => {
	const {
		showCompleteProfile,
		showFirstWelcomeModal,
		showSignWithWallet,
		showWalletModal,
		showWelcomeModal,
	} = useAppSelector(state => state.modal);

	const { userData, isSignedIn } = useAppSelector(state => state.user);
	const isRegistered = isUserRegistered(userData);

	const dispatch = useAppDispatch();

	const { active } = useWeb3React();

	useEffect(() => {
		if (isRegistered && showCompleteProfile) {
			dispatch(setShowCompleteProfile(false));
		}
	}, [isRegistered]);

	useEffect(() => {
		if (showWelcomeModal) {
			dispatch(setShowWelcomeModal(false));
		}
	}, [active]);

	useEffect(() => {
		if (isSignedIn && showSignWithWallet) {
			dispatch(setShowSignWithWallet(false));
		}
	}, [isSignedIn]);

	return (
		<AnimatePresence>
			{showWalletModal && (
				<WalletModal
					setShowModal={state => dispatch(setShowWalletModal(state))}
				/>
			)}
			{showSignWithWallet && (
				<SignWithWalletModal
					setShowModal={state =>
						dispatch(setShowSignWithWallet(state))
					}
				/>
			)}
			{showCompleteProfile && (
				<CompleteProfileModal
					setShowModal={state =>
						dispatch(setShowCompleteProfile(state))
					}
				/>
			)}
			{showWelcomeModal && (
				<WelcomeModal
					setShowModal={state => dispatch(setShowWelcomeModal(state))}
				/>
			)}
			{showFirstWelcomeModal && (
				<FirstWelcomeModal
					setShowModal={state =>
						dispatch(setShowFirstWelcomeModal(state))
					}
				/>
			)}
		</AnimatePresence>
	);
};

export default ModalController;
