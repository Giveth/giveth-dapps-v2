import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { formatEther } from '@ethersproject/units';
import { captureException } from '@sentry/nextjs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setBalance,
	setIsEnabled,
	setIsSignedIn,
	setToken,
} from '@/features/user/user.slice';
import { isSSRMode } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { walletsArray } from '@/lib/wallet/walletTypes';

const UserController = () => {
	const { account, library, chainId, activate } = useWeb3React();
	const dispatch = useAppDispatch();
	const token = !isSSRMode ? localStorage.getItem(StorageLabel.TOKEN) : null;
	const isEnabled = useAppSelector(state => state.user.isEnabled);
	const isSignIn = useAppSelector(state => state.user.isSignedIn);
	console.log('UserController', isEnabled, isSignIn);
	const getBalance = () => {
		if (account && library) {
			library
				.getBalance(account)
				.then((_balance: string) => {
					const balance = parseFloat(formatEther(_balance)).toFixed(
						3,
					);
					console.log('balance', balance);
					dispatch(setBalance(balance));
				})
				.catch((error: unknown) => {
					dispatch(setBalance(null));
					captureException(error, {
						tags: {
							section: 'getBalance',
						},
					});
				});
		}
	};

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
		if (account) dispatch(fetchUserByAddress(account));
	}, [account]);

	useEffect(() => {
		if (account && token) {
			dispatch(setIsEnabled(true));
			dispatch(setIsSignedIn(true));
		} else if (account) {
			dispatch(setIsEnabled(true));
		}
	}, [account, token]);

	useEffect(() => {
		if (token) {
			dispatch(setToken(token));
		}
	}, [token]);

	useEffect(() => {
		if (account && library) {
			library?.on('block', () => {
				getBalance();
			});
		}
		return () => {
			library?.removeAllListeners('block');
		};
	}, [library]);

	useEffect(() => {
		getBalance();
	}, [account, library, chainId]);

	return null;
};

export default UserController;
