import { useEffect } from 'react';
import { useAccount } from 'wagmi';
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
	setShowSearchModal,
	setShowSwitchNetworkModal,
} from '@/features/modal/modal.slice';
import { isUserRegistered } from '@/lib/helpers';
import { SearchModal } from '../modals/SearchModal';
import SwitchNetwork from '../modals/SwitchNetwork';

const ModalController = () => {
	const {
		showCompleteProfile,
		showFirstWelcomeModal,
		showSignWithWallet,
		showWalletModal,
		showWelcomeModal,
		showSearchModal,
		showSwitchNetwork,
	} = useAppSelector(state => state.modal);

	const { userData, isSignedIn } = useAppSelector(state => state.user);
	const isRegistered = isUserRegistered(userData);

	const dispatch = useAppDispatch();

	const { isConnected } = useAccount();

	useEffect(() => {
		if (isRegistered && showCompleteProfile) {
			dispatch(setShowCompleteProfile(false));
		}
	}, [isRegistered]);

	useEffect(() => {
		if (showWelcomeModal && isConnected) {
			dispatch(setShowWelcomeModal(false));
		}
	}, [isConnected, showWelcomeModal]);

	//I think we need to handle it in better way
	useEffect(() => {
		if (isSignedIn && showSignWithWallet) {
			setTimeout(() => {
				dispatch(setShowSignWithWallet(false));
			}, 300);
		}
	}, [isSignedIn]);

	return (
		<>
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
			{showSearchModal && (
				<SearchModal
					setShowModal={state => dispatch(setShowSearchModal(state))}
				/>
			)}
			{showSwitchNetwork && (
				<SwitchNetwork
					setShowModal={state =>
						dispatch(setShowSwitchNetworkModal(state))
					}
				/>
			)}
		</>
	);
};

export default ModalController;
