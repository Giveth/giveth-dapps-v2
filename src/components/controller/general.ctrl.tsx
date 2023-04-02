import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { createGlobalStyle, css } from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ETheme } from '@/features/general/general.slice';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { switchNetwork } from '@/lib/wallet';

const GeneralController = () => {
	const dispatch = useAppDispatch();
	const { chainId, account, active: isWalletActive } = useWeb3React();
	const router = useRouter();
	const theme = useAppSelector(state => state.general.theme);
	useEffect(() => {
		if (!router) return;
		const { chain } = router.query;
		const _chain = Array.isArray(chain) ? chain[0] : chain;
		if (_chain) {
			dispatch(setShowWalletModal(!isWalletActive));

			const _chainId =
				_chain === 'gnosis'
					? config.XDAI_NETWORK_NUMBER
					: config.MAINNET_NETWORK_NUMBER;
			if (isWalletActive && chainId !== _chainId) {
				switchNetwork(_chainId);
			}
		}
	}, [router, account, isWalletActive, chainId]);
	return <GlobalStyle theme={theme} />;
};

const GlobalStyle = createGlobalStyle<{ theme: ETheme }>`
  :root {
	${props =>
		props.theme === ETheme.Dark
			? css`
					--bgColor: ${brandColors.giv[900]} !important;
					--color: white !important;
					--scrollColor: ${brandColors.giv[400]} !important;
					--scrollHoverColor: ${brandColors.giv[700]} !important;
			  `
			: props.theme === ETheme.Light
			? css`
					--bgColor: ${neutralColors.gray[200]} !important;
					--color: ${neutralColors.gray[900]} !important;
					--scrollColor: #d6dee1 !important;
					--scrollHoverColor: #a8bbbf !important;
			  `
			: ''}
    
	
  }
`;

// const GlobalStyle = createGlobalStyle<{ theme: ETheme }>`
//   body {
// 	${props =>
// 		props.theme === ETheme.Dark
// 			? css`
// 					background-color: ${brandColors.giv[900]};
// 					color: ${'white'};
// 			  `
// 			: props.theme === ETheme.Light
// 			? css`
// 					background-color: ${neutralColors.gray[200]};
// 					color: ${neutralColors.gray[900]};
// 			  `
// 			: ''}

//   }
// `;

export default GeneralController;
