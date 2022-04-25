import styled from 'styled-components';
import {
	D3,
	H1,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
	ButtonLink,
	D1,
} from '@giveth/ui-design-system';
import { TopContainer } from './commons';
import { device, mediaQueries } from '@/lib/constants/constants';

export const OverviewBottomContainer = styled.div`
	background-image: url('/images/backgrounds/wave.svg');
	background-position: center;
	background-repeat: repeat-x;
`;

export const OverviewTopContainer = styled(TopContainer)`
	height: 650px;
`;

export const OverviewTitle = styled(D1)`
	padding-bottom: 36px;
	font-size: 4.4rem;
	${mediaQueries.tablet} {
		font-size: 6.69rem;
	}
`;

export const PreTitle = styled(D3)`
	padding-top: 77px;
	display: block;
	font-size: 4.4rem;
	color: ${brandColors.deep[100]};
	${mediaQueries.tablet} {
		font-size: 5.5rem;
	}
`;

export const SubTitle = styled(QuoteText)``;

export const ClaimCardButton = styled(Button)`
	width: 221px;
	margin-top: 36px;
	margin-bottom: 36px;
	${mediaQueries.tablet} {
		width: 300px;
	}
`;

export const TabTitle = styled(H1)`
	margin-bottom: 40px;
`;

export const TabDesc = styled(QuoteText)`
	margin-bottom: 50px;
`;

export const Section2Title = styled(H1)`
	margin-top: 124px;
	margin-bottom: 60px;
	color: ${brandColors.giv[200]};
`;

export const ClaimCard = styled.div`
	background-color: #3c14c5;
	padding: 141px 16px 106px;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	min-height: 480px;
	margin: 80px 0 45px;
	position: relative;
	::before {
		content: url('/images/pie1.png');
		position: absolute;
		top: 0;
		right: 0;
	}
	::after {
		content: url('/images/pie2.png');
		position: absolute;
		bottom: -4px;
		left: 0;
	}
	@media ${device.laptop} {
		padding: 100px 50px 146px;
	}
	@media ${device.laptopL} {
		padding: 100px 64px 146px;
	}
	@media ${device.desktop} {
		padding: 100px 64px 146px;
	}
`;
export const ClaimCardTitle = styled(H1)`
	margin-bottom: 22px;
`;

export const DataBlockWithMargin = styled(DataBlock)`
	margin-bottom: 32px;
`;

export const DataBlockButton = styled(ButtonLink)`
	margin-top: auto;
`;

export const ClaimCardQuote = styled(QuoteText)`
	color: ${brandColors.giv[200]};
`;

export const VideoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	margin: auto;
	width: 100%;
	max-width: 1440px;
	overflow: hidden;
	margin-bottom: 100px;
`;

export const VideoOverlay = styled.div<{ hidden: boolean }>`
	display: ${props => (props.hidden ? 'none' : 'flex')};
	justify-content: center;
	align-items: center;
	left: 0px;
	top: 0px;
	bottom: 0px;
	width: 100%;
	height: 100%;
	position: absolute;
	background: rgba(0, 0, 0, 0.3);
	transition: background 0.3s ease-in-out;
	user-select: none;
	&:hover {
		background: rgba(0, 0, 0, 0.5);
	}
`;
