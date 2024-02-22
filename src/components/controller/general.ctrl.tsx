import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { createGlobalStyle, css } from 'styled-components';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { ETheme } from '@/features/general/general.slice';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import {
	fetchMainCategories,
	fetchQFRounds,
} from '@/features/general/general.thunk';

const GeneralController = () => {
	const dispatch = useAppDispatch();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address, isConnected: isWalletActive } = useAccount();
	const { switchChain } = useSwitchChain();
	const router = useRouter();
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		dispatch(fetchMainCategories());
		dispatch(fetchQFRounds());
	}, [dispatch]);

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
		}
	}, [router, address, isWalletActive, chainId]);

	return <GlobalStyle themeState={theme} />;
};

const GlobalStyle = createGlobalStyle<{ themeState?: ETheme }>`
  :root {
	${props =>
		props.themeState === ETheme.Dark
			? css`
					--bgColor: ${brandColors.giv[900]} !important;
					--color: white !important;
					--scrollColor: ${brandColors.giv[400]} !important;
					--scrollHoverColor: ${brandColors.giv[700]} !important;
				`
			: props.themeState === ETheme.Light
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
