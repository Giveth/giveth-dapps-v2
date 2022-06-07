import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
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
} from '@/features/modal/modal.sclie';

const ModalController = () => {
	const {
		showCompleteProfile,
		showFirstWelcomeModal,
		showSignWithWallet,
		showWalletModal,
		showWelcomeModal,
	} = useAppSelector(state => state.modal);
	const dispatch = useAppDispatch();

	const { active } = useWeb3React();

	useEffect(() => {
		if (showWelcomeModal) {
			dispatch(setShowWelcomeModal(false));
		}
	}, [active]);

	return (
		<>
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
		</>
	);
};

export default ModalController;
