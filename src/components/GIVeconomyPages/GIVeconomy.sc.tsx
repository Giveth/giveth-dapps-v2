import styled from 'styled-components';
import { H1, QuoteText, DataBlock, ButtonLink } from '@giveth/ui-design-system';

export const TopSpacer = styled.div`
	height: 24px;
`;

export const OverviewBottomContainer = styled.div`
	background-image: url('/images/backgrounds/wave.svg');
	background-position: center;
	background-repeat: repeat-x;
	background-size: 200px;
	padding-bottom: 120px;
	margin-top: 100px;
`;

export const TabTitle = styled(H1)`
	margin-bottom: 40px;
`;

export const TabDesc = styled(QuoteText)`
	margin-bottom: 50px;
`;

export const DataBlockWithMargin = styled(DataBlock)`
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
`;

export const DataBlockButton = styled(ButtonLink)`
	margin-top: auto;
	padding: 24px 48px;
	width: max-content;
	min-width: 300px;
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
	cursor: pointer;
`;

export const VideoOverlay = styled.div<{ $hidden: boolean }>`
	display: ${props => (props.$hidden ? 'none' : 'flex')};
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
