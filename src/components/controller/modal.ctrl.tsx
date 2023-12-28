import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { FirstWelcomeModal } from '@/components/modals/FirstWelcomeModal';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowFirstWelcomeModal,
	setShowSignWithWallet,
	setShowSearchModal,
	setShowSwitchNetworkModal,
	setShowWelcomeModal,
} from '@/features/modal/modal.slice';
import { isUserRegistered } from '@/lib/helpers';
import { SearchModal } from '../modals/SearchModal';
import SwitchNetwork from '../modals/SwitchNetwork';
import { useAuthenticationWallet } from '@/hooks/useAuthenticationWallet';

const ModalController = () => {
	const {
		showCompleteProfile,
		showFirstWelcomeModal,
		showSignWithWallet,
		showWelcomeModal,
		showSearchModal,
		showSwitchNetwork,
	} = useAppSelector(state => state.modal);

	const { userData, isSignedIn } = useAppSelector(state => state.user);
	const isRegistered = isUserRegistered(userData);
	const { connector } = useAccount();
	const isGSafeConnector = connector?.id === 'safe';
	const isSafeEnv = useIsSafeEnvironment();

	const dispatch = useAppDispatch();

	const { isConnected } = useAuthenticationWallet();

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
		// (Mateo): Only make it happen if it's not a gnosis safe environment
		// we have a different logic for modal management there
		if (isSignedIn && showSignWithWallet && !isSafeEnv) {
			setTimeout(() => {
				dispatch(setShowSignWithWallet(false));
			}, 300);
		}
	}, [isSignedIn]);

	return (
		<>
			{showSignWithWallet && (
				<SignWithWalletModal
					isGSafeConnector={isGSafeConnector}
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
