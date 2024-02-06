import { useEffect, useRef } from 'react';
import { useConnect } from 'wagmi';
import { useAppDispatch } from '@/features/hooks';
import {
	setToken,
	setIsEnabled,
	setIsLoading,
} from '@/features/user/user.slice';
import StorageLabel from '@/lib/localStorage';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { getTokens } from '@/helpers/user';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

const UserController = () => {
	const {
		walletAddress: address,
		isConnected,
		isConnecting,
		walletChainType,
	} = useGeneralWallet();
	const dispatch = useAppDispatch();
	const isSafeEnv = useIsSafeEnvironment();
	const { connect, connectors } = useConnect();
	const isMounted = useRef(false);
	const isFirstRender = useRef(true);
	const isConnectingRef = useRef(isConnecting);
	const isConnectedRef = useRef(isConnected);

	useEffect(() => {
		// for safe auto connect is handled somewhere else
		console.log({ isSafeEnv });
		if (isSafeEnv === null || !!isSafeEnv) return;
		// TODO: implement auto connect for solana
		if (
			isConnected ||
			(walletChainType !== null && walletChainType !== ChainType.EVM)
		)
			return;

		const isPrevConnected = localStorage.getItem(
			StorageLabel.WAGMI_CONNECTED,
		);

		if (isPrevConnected !== 'true') return;

		const connectedWallet = localStorage
			.getItem(StorageLabel.WAGMI_WALLET)
			?.replaceAll('"', '');

		const connector = connectors.find(
			c => c.id.toLowerCase() === connectedWallet?.toLowerCase(),
		);

		if (connector) {
			connect({ connector });
		}
	}, [isSafeEnv]);

	useEffect(() => {
		if (isSafeEnv === null) return; // not ready
		isConnectingRef.current = isConnecting;
		isConnectedRef.current = isConnected;
		if (!isConnecting && isFirstRender.current) {
			setTimeout(() => {
				if (!isConnectingRef.current && !isConnectedRef.current) {
					dispatch(setIsLoading(false));
				}
			}, 1000);
		}
		isFirstRender.current = false;
	}, [isConnecting]);

	useEffect(() => {
		if (isSafeEnv === null) return; // not ready
		if (isMounted.current) {
			if (!address) {
				// Case when wallet is locked
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
