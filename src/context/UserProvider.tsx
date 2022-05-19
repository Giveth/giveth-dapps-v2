import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

import { captureException } from '@sentry/nextjs';
import { initializeApollo } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import {
	compareAddresses,
	showToastError,
	signMessage,
	postData,
	createSiweMessage,
} from '@/lib/helpers';
import { getToken } from '@/services/token';
import { IUser } from '@/apollo/types/types';
import StorageLabel from '@/lib/localStorage';
import { walletsArray } from '@/lib/wallet/walletTypes';
import config from '@/configuration';

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
		reFetchUser: () => void;
		incrementLikedProjectsCount: () => void;
		decrementLikedProjectsCount: () => void;
		getBalance: () => void;
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
		reFetchUser: () => {},
		incrementLikedProjectsCount: () => {},
		decrementLikedProjectsCount: () => {},
		getBalance: () => {},
	},
});

UserContext.displayName = 'UserContext';

const apolloClient = initializeApollo();

export const UserProvider = (props: { children: ReactNode }) => {
	const { account, library, chainId, activate } = useWeb3React();

	const [user, setUser] = useState<IUser | undefined>();
	const [balance, setBalance] = useState<string | null>(null);
	const router = useRouter();

	const isEnabled = !!library?.getSigner() && !!account && !!chainId;
	const isSignedIn = isEnabled && !!user?.token;

	useEffect(() => {
		const selectedWalletName = localStorage.getItem(StorageLabel.WALLET);
		const wallet = walletsArray.find(w => w.value === selectedWalletName);
		if (wallet) {
			activate(wallet.connector, err => {
				console.log('err', err);
			});
		}
	}, [activate]);

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
		if (account && library) {
			getBalance();
		}
	}, [account, library, chainId]);

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
				const localAddress = localStorage.getItem(StorageLabel.USER);
				if (compareAddresses(localAddress, newUser?.walletAddress)) {
					const token = localStorage.getItem(StorageLabel.TOKEN);
					return { ...newUser, token };
				}
				removeToken();
				return newUser;
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchUser',
					},
				});
			});
	};

	const reFetchUser = () => {
		fetchUser().then(setUser);
	};

	const setToken = (token: string) => {
		localStorage.setItem(StorageLabel.USER, user?.walletAddress || '');
		localStorage.setItem(StorageLabel.TOKEN, token);
	};

	const removeToken = () => {
		localStorage.removeItem(StorageLabel.USER);
		localStorage.removeItem(StorageLabel.TOKEN);
	};

	const signOut = () => {
		removeToken();
		setUser({ ...user, token: undefined });
	};

	const signToGetToken = async () => {
		const siweMessage: any = await createSiweMessage(
			account!,
			chainId!,
			router.pathname,
			'Login into Giveth services',
		);
		const { nonce, message } = siweMessage;
		const signature = await library.getSigner().signMessage(message);

		if (!signature) return false;

		const token = await getToken(signature, message, nonce);
		const authorizedToken = await authorizeToken(token.jwt);
		await apolloClient.resetStore();
		setToken(authorizedToken);
		setUser({ ...user, token: authorizedToken });

		return authorizedToken;
	};

	const authorizeToken = async (jwt: string) => {
		const authorization = await postData(
			`${config.MICROSERVICES.authentication}/authorization`,
			{
				jwt,
			},
		);
		return authorization.jwt;
	};

	const getBalance = () => {
		library
			.getBalance(account)
			.then((_balance: BigNumberish) => {
				setBalance(parseFloat(formatEther(_balance)).toFixed(3));
			})
			.catch((error: unknown) => {
				setBalance(null);
				captureException(error, {
					tags: {
						section: 'getBalance',
					},
				});
			});
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
					signToGetToken,
					signOut,
					reFetchUser,
					incrementLikedProjectsCount,
					decrementLikedProjectsCount,
					getBalance,
				},
			}}
		>
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
