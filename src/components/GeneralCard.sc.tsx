import { P, Button, H4, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from './styled-components/Shadow';

export const ButtonStyled = styled(Button)`
	text-transform: uppercase;
	margin: 24px auto 0 auto;
	width: 265px;
	height: 66px;
	padding: 0;
	min-height: 33px;
`;

export const Title = styled(H4)`
	margin-top: 10px;
	max-width: calc(100vw - 72px);
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
	text-align: left;
	max-width: calc(100vw - 72px);
	padding: 0;

	${mediaQueries.tablet} {
		padding: 0 0 0 84px;
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
	margin: 26px 0;
	flex-direction: column;
	padding: 36px 32px;
	max-width: calc(100vw - 36px);

	${mediaQueries.tablet} {
		flex-direction: row;
		padding: 45px 72px;
		max-width: 1141px;
		min-height: 220px;
		width: 100%;
	}
`;
