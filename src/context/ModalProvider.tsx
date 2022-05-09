import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';

import WalletModal from '@/components/modals/WalletModal';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { FirstWelcomeModal } from '@/components/modals/FirstWelcomeModal';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

interface IModalContext {
	actions: {
		showWalletModal: () => void;
		showSignWithWallet: () => void;
		showWelcomeModal: () => void;
		showFirstWelcomeModal: () => void;
		showCompleteProfile: () => void;
	};
}

const ModalContext = createContext<IModalContext>({
	actions: {
		showWalletModal: () => {},
		showWelcomeModal: () => {},
		showFirstWelcomeModal: () => {},
		showSignWithWallet: () => {},
		showCompleteProfile: () => {},
	},
});

ModalContext.displayName = 'ModalContext';

export const ModalProvider = (props: { children: ReactNode }) => {
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [showWelcomeModal, setShowWelcomeModal] = useState(false);
	const [showFirstWelcomeModal, setShowFirstWelcomeModal] = useState(false);
	const [showSignWithWallet, setShowSignWithWallet] = useState(false);
	const [showCompleteProfile, setShowCompleteProfile] = useState(false);

	const { account } = useWeb3React();

	useEffect(() => {
		if (account) {
			setShowWelcomeModal(false);
		}
	}, [account]);

	return (
		<ModalContext.Provider
			value={{
				actions: {
					showSignWithWallet: () => setShowSignWithWallet(true),
					showWalletModal: () => setShowWalletModal(true),
					showFirstWelcomeModal: () => setShowFirstWelcomeModal(true),
					showCompleteProfile: () => setShowCompleteProfile(true),
					showWelcomeModal: () => setShowWelcomeModal(true),
				},
			}}
		>
			{showWalletModal && (
				<WalletModal setShowModal={setShowWalletModal} />
			)}
			{showSignWithWallet && (
				<SignWithWalletModal setShowModal={setShowSignWithWallet} />
			)}
			{showCompleteProfile && (
				<CompleteProfileModal setShowModal={setShowCompleteProfile} />
			)}
			{showWelcomeModal && (
				<WelcomeModal setShowModal={setShowWelcomeModal} />
			)}
			{showFirstWelcomeModal && (
				<FirstWelcomeModal setShowModal={setShowFirstWelcomeModal} />
			)}
			{props.children}
		</ModalContext.Provider>
	);
};

export default function useModal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('Modal context not found!');
	}
	return context;
}
