import { P, Button, H4, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from './styled-components/Shadow';

export const ButtonStyled = styled(Button)`
	text-transform: uppercase;
	margin: 24px auto 0;
	width: 200px;
	height: 50px;
	padding: 0;
	min-height: 33px;
	* {
		font-size: 12px !important;
	}

	${mediaQueries.mobileL} {
		width: 265px;
		height: 66px;
		* {
			font-size: 14px !important;
		}
	}
`;

export const Title = styled(H4)`
	margin-top: 10px;
	max-width: calc(100vw - 72px);
	font-weight: 700;
`;

export const Caption = styled(P)`
	max-width: calc(100vw - 72px);
	width: ${(props: { fullWidth?: boolean }) =>
		props.fullWidth ? '100%' : 'auto'};
`;

export const TitleSection = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
`;

export const HorizontalTitleSection = styled.div`
	display: flex;
	flex-direction: column;
	max-width: calc(100vw - 72px);

	${mediaQueries.tablet} {
		text-align: left;
		padding: 0 15px 0 70px;
		width: ${(props: { fullWidth?: boolean }) =>
			props.fullWidth ? '100%' : '485px'};
	}
`;

export const Wrapper = styled(FlexCenter)`
	z-index: 2;
	background: white;
	text-align: center;
	color: ${brandColors.giv[800]};
	max-width: 558px;
	width: 100%;
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	flex-direction: column;
	padding: 36px 32px;

	${mediaQueries.tablet} {
		padding: 64px 85px;
		height: 500px;
	}
`;

export const HorizontalWrap = styled.div`
	z-index: 2;
	display: flex;
	background: white;
	align-items: center;
	color: ${brandColors.giv[800]};
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	flex-direction: column;
	padding: 36px 32px;
	max-width: calc(100vw - 36px);

	${mediaQueries.tablet} {
		flex-direction: row;
		padding: 36px 32px;
		min-height: 220px;
		width: 100%;
	}
	${mediaQueries.desktop} {
		padding: 45px 72px;
	}
`;
