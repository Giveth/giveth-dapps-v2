import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

import { initializeApollo } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import {
	compareAddresses,
	getLocalTokenLabel,
	getLocalUserLabel,
	showToastError,
	signMessage,
} from '@/lib/helpers';
import { getToken } from '@/services/token';
import useWallet from '@/hooks/walletHooks';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { IUser } from '@/apollo/types/types';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

interface IUserContext {
	state: {
		user?: IUser;
		balance?: string | null;
		isEnabled?: boolean;
		isSignedIn?: boolean;
	};
	actions: {
		signToGetToken: () => Promise<boolean | string>;
		signOut?: () => void;
		showSignWithWallet: () => void;
		showCompleteProfile: () => void;
		showWelcomeModal: (e: boolean) => void;
		reFetchUser: () => void;
		incrementLikedProjectsCount: () => void;
		decrementLikedProjectsCount: () => void;
	};
}

const UserContext = createContext<IUserContext>({
	state: {
		user: undefined,
		isEnabled: false,
		isSignedIn: false,
	},
	actions: {
		signToGetToken: async () => false,
		signOut: () => {},
		showSignWithWallet: () => {},
		showCompleteProfile: () => {},
		showWelcomeModal: () => {},
		reFetchUser: () => {},
		incrementLikedProjectsCount: () => {},
		decrementLikedProjectsCount: () => {},
	},
});

const apolloClient = initializeApollo();

export const UserProvider = (props: { children: ReactNode }) => {
	const { account, library, chainId } = useWeb3React();
	useWallet();

	const [user, setUser] = useState<IUser | undefined>();
	const [balance, setBalance] = useState<string | null>(null);
	const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
	const [showSignWithWallet, setShowSignWithWallet] = useState(false);
	const [showCompleteProfile, setShowCompleteProfile] = useState(false);

	const isEnabled = !!library?.getSigner() && !!account && !!chainId;
	const isSignedIn = isEnabled && !!user?.token;

	useEffect(() => {
		if (account) reFetchUser();
		else setUser(undefined);
	}, [account]);

	useEffect(() => {
		library?.on('block', () => {
			getBalance();
		});
		return () => {
			library?.removeAllListeners('block');
		};
	}, [library]);

	useEffect(() => {
		if (!!account && !!library) {
			getBalance();
		}
	}, [account, user, library, chainId]);

	const fetchUser = () => {
		return apolloClient
			.query({
				query: GET_USER_BY_ADDRESS,
				variables: {
					address: account?.toLowerCase(),
				},
				fetchPolicy: 'network-only',
			})
			.then((res: any) => {
				const newUser = res.data?.userByAddress;
				const localAddress = localStorage.getItem(getLocalUserLabel());
				if (compareAddresses(localAddress, newUser?.walletAddress)) {
					const token = localStorage.getItem(getLocalTokenLabel());
					return { ...newUser, token };
				}
				removeToken();
				return newUser;
			})
			.catch(showToastError);
	};

	const reFetchUser = () => {
		fetchUser().then(setUser);
	};

	const setToken = (token: string) => {
		localStorage.setItem(getLocalUserLabel(), user?.walletAddress || '');
		localStorage.setItem(getLocalTokenLabel(), token);
	};

	const removeToken = () => {
		localStorage.removeItem(getLocalUserLabel());
		localStorage.removeItem(getLocalTokenLabel());
	};

	const signOut = () => {
		removeToken();
		setUser({ ...user, token: undefined });
	};

	const signToGetToken = async () => {
		if (!library?.getSigner()) {
			setShowWelcomeModal(true);
			return;
		}

		const signedMessage = await signMessage(
			process.env.NEXT_PUBLIC_OUR_SECRET as string,
			account,
			chainId,
			library.getSigner(),
		);
		if (!signedMessage) return false;

		const token = await getToken(account, signedMessage, chainId, user);
		await apolloClient.resetStore();
		setToken(token);
		setUser({ ...user, token });
		return token;
	};

	const getBalance = () => {
		library
			.getBalance(account)
			.then((_balance: BigNumberish) => {
				setBalance(parseFloat(formatEther(_balance)).toFixed(3));
			})
			.catch(() => setBalance(null));
	};

	const incrementLikedProjectsCount = () => {
		if (user) {
			setUser({
				...user,
				likedProjectsCount: (user.likedProjectsCount || 0) + 1,
			});
		}
	};

	const decrementLikedProjectsCount = () => {
		if (user) {
			setUser({
				...user,
				likedProjectsCount: (user.likedProjectsCount || 1) - 1,
			});
		}
	};

	return (
		<UserContext.Provider
			value={{
				state: {
					user,
					balance,
					isEnabled,
					isSignedIn,
				},
				actions: {
					showSignWithWallet: () => setShowSignWithWallet(true),
					showCompleteProfile: () => setShowCompleteProfile(true),
					showWelcomeModal: setShowWelcomeModal,
					signToGetToken,
					signOut,
					reFetchUser,
					incrementLikedProjectsCount,
					decrementLikedProjectsCount,
				},
			}}
		>
			{showCompleteProfile && (
				<CompleteProfileModal
					closeModal={() => setShowCompleteProfile(false)}
				/>
			)}
			{showSignWithWallet && (
				<SignWithWalletModal
					showModal={showSignWithWallet}
					setShowModal={() => setShowSignWithWallet(false)}
				/>
			)}
			{showWelcomeModal && (
				<WelcomeModal
					showModal={showWelcomeModal}
					closeModal={() => setShowWelcomeModal(false)}
				/>
			)}
			{props.children}
		</UserContext.Provider>
	);
};

export default function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('Claim context not found!');
	}

	return context;
}
