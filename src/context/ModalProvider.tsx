import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';

import LowerShields from '@/components/modals/LowerShields';
import WalletModal from '@/components/modals/WalletModal';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

interface IModalContext {
	state: {
		lowerShields: boolean;
	};
	actions: {
		showLowerShields: () => void;
		showWalletModal: () => void;
		showSignWithWallet: () => void;
		showWelcomeModal: () => void;
		showCompleteProfile: () => void;
	};
}

const ModalContext = createContext<IModalContext>({
	state: {
		lowerShields: false,
	},
	actions: {
		showLowerShields: () => {},
		showWalletModal: () => {},
		showWelcomeModal: () => {},
		showSignWithWallet: () => {},
		showCompleteProfile: () => {},
	},
});

export const ModalProvider = (props: { children: ReactNode }) => {
	const [showLowerShields, setShowLowerShields] = useState(false);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [showWelcomeModal, setShowWelcomeModal] = useState(false);
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
				state: {
					lowerShields: showLowerShields,
				},
				actions: {
					showSignWithWallet: () => setShowSignWithWallet(true),
					showLowerShields: () => setShowLowerShields(true),
					showWalletModal: () => setShowWalletModal(true),
					showCompleteProfile: () => setShowCompleteProfile(true),
					showWelcomeModal: () => setShowWelcomeModal(true),
				},
			}}
		>
			{showLowerShields && (
				<LowerShields setShowModal={setShowLowerShields} />
			)}
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
