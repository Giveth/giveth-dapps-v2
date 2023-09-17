import { useWeb3React } from '@web3-react/core';
import { useEffect, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useAppDispatch } from '@/features/hooks';
import { setToken, setIsEnabled } from '@/features/user/user.slice';
import StorageLabel from '@/lib/localStorage';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { getTokens } from '@/helpers/user';

const UserController = () => {
	const { library } = useWeb3React();
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const dispatch = useAppDispatch();

	const isMounted = useRef(false);
	console.log('Library', isConnected);

	// TODO: Check this section's functionality and remove it if it's not needed
	// useEffect(() => {
	// 	const selectedWalletName = localStorage.getItem(StorageLabel.WALLET);
	// 	const wallet = walletsArray.find(w => w.value === selectedWalletName);
	// 	// try to connect to safe. this is only for the gnosis safe environment, it won't stop the flow if it fails
	// 	const safeWallet = walletsArray.find(w => w.name === 'GnosisSafe');
	// 	if (safeWallet) {
	// 		activate(safeWallet.connector, console.log)
	// 			.then(() => setIsActivatedCalled(true))
	// 			.finally(() => {
	// 				if (!token) dispatch(setIsLoading(false));
	// 			});
	// 	}

	// 	if (wallet && wallet.connector instanceof InjectedConnector) {
	// 		wallet.connector
	// 			.isAuthorized()
	// 			.then(isAuthorized => {
	// 				if (isAuthorized) {
	// 					activate(wallet.connector, console.log)
	// 						.then(() => setIsActivatedCalled(true))
	// 						.finally(() => {
	// 							if (!token) dispatch(setIsLoading(false));
	// 						});
	// 				} else {
	// 					dispatch(setIsLoading(false));
	// 				}
	// 			})
	// 			.catch(() => dispatch(setIsLoading(false)));
	// 	} else {
	// 		dispatch(setIsLoading(false));
	// 	}
	// }, [activate, isActivatedCalled]);

	useEffect(() => {
		if (isMounted.current) {
			if (!address) {
				// Case when wallet is locked
				//TODO: Remove this state if Wagmi handles isEnabled properly
				dispatch(setIsEnabled(false));
			}
		}
		if (address) {
			const tokens = getTokens();
			const _account = address.toLowerCase();
			if (tokens[_account]) {
				dispatch(setToken(tokens[_account]));
				localStorage.setItem(StorageLabel.USER, _account);
				localStorage.setItem(StorageLabel.TOKEN, tokens[_account]);
			} else {
				localStorage.removeItem(StorageLabel.TOKEN);
				localStorage.removeItem(StorageLabel.USER);
			}
			isMounted.current = true;
			dispatch(fetchUserByAddress(address));
			dispatch(setIsEnabled(true));
		}
	}, [address]);

	return null;
};

export default UserController;
