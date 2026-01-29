import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { createGlobalStyle, css } from 'styled-components';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { ETheme } from '@/features/general/general.slice';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import config from '@/configuration';
import { useMiniKitContext } from '@/components/MiniKitProvider';
import { BASE_APP_CLIENT_FID_EFFECTIVE } from '@/hooks/useMiniApp';
import {
	fetchGlobalScoreSettings,
	fetchMainCategoriesAndActiveQFRound,
} from '@/features/general/general.thunk';

const GeneralController = () => {
	const dispatch = useAppDispatch();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address, isConnected: isWalletActive } = useAccount();
	const { switchChain } = useSwitchChain();
	const router = useRouter();
	const theme = useAppSelector(state => state.general.theme);
	const { isInMiniApp, farcasterContext } = useMiniKitContext();
	const baseAutoSwitchAttemptedRef = useRef(false);

	const clientFid =
		(farcasterContext as any)?.client?.clientFid != null
			? Number((farcasterContext as any).client.clientFid)
			: null;
	const isBaseMiniAppHost =
		isInMiniApp && clientFid === BASE_APP_CLIENT_FID_EFFECTIVE;

	useEffect(() => {
		dispatch(fetchMainCategoriesAndActiveQFRound());
		dispatch(fetchGlobalScoreSettings());
	}, []);

	// Reset attempt flag when wallet disconnects / changes.
	useEffect(() => {
		if (!isWalletActive) baseAutoSwitchAttemptedRef.current = false;
	}, [isWalletActive, address]);

	useEffect(() => {
		if (!router) return;
		const { chain } = router.query;
		const _chain = Array.isArray(chain) ? chain[0] : chain;
		if (_chain) {
			dispatch(setShowWalletModal(!isWalletActive));

			const _chainId = parseInt(_chain);

			if (isWalletActive && chainId !== _chainId) {
				switchChain?.({ chainId: _chainId });
			}
			return;
		}

		// Base App Mini App users should default to Base network.
		// Only apply when there's no explicit `?chain=` override.
		if (
			isBaseMiniAppHost &&
			isWalletActive &&
			chainId != null &&
			chainId !== config.BASE_NETWORK_NUMBER &&
			!baseAutoSwitchAttemptedRef.current
		) {
			baseAutoSwitchAttemptedRef.current = true;
			switchChain?.({ chainId: config.BASE_NETWORK_NUMBER });
		}
	}, [
		router,
		address,
		isWalletActive,
		chainId,
		isBaseMiniAppHost,
		switchChain,
		dispatch,
	]);

	return <GlobalStyle $baseTheme={theme} />;
};

const GlobalStyle = createGlobalStyle<{ $baseTheme?: ETheme }>`
  :root {
	${props =>
		props.$baseTheme === ETheme.Dark
			? css`
					--bgColor: ${brandColors.giv[900]} !important;
					--color: white !important;
					--scrollColor: ${brandColors.giv[400]} !important;
					--scrollHoverColor: ${brandColors.giv[700]} !important;
				`
			: props.$baseTheme === ETheme.Light
				? css`
						--bgColor: ${neutralColors.gray[200]} !important;
						--color: ${neutralColors.gray[900]} !important;
						--scrollColor: #d6dee1 !important;
						--scrollHoverColor: #a8bbbf !important;
					`
				: ''}
    
	
  }
`;

export default GeneralController;
