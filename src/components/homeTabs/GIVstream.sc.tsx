import styled from 'styled-components';

import {
	D1,
	H2,
	H4,
	P,
	QuoteText,
	DataBlock,
	brandColors,
	GLink,
	neutralColors,
	Subline,
	ButtonLink,
} from '@giveth/ui-design-system';
import {
	TopContainer,
	TopInnerContainer,
	BottomContainer,
	EnhancedRewardCard,
} from './commons';
import { Flex } from '../styled-components/Flex';
import { DataBox } from '../DataBox';
import { mediaQueries } from '@/utils/constants';

export const GIVstreamTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;

export const GIVstreamTopInnerContainer = styled(TopInnerContainer)`
	/* overflow: hidden; */
	&::before {
		content: url('/images/stream.svg');
		position: absolute;
		right: 350px;
		top: calc(50% - 240px);
		z-index: 0;
	}
`;

export const Left = styled.div`
	z-index: 1;
`;

export const Right = styled.div`
	align-self: end;
`;

export const GSTitle = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const GSSubtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 32px;
	}
`;

export const GIVstreamRewardCard = styled(EnhancedRewardCard)`
	margin-bottom: 24px;
	${mediaQueries.tablet} {
		margin-bottom: 0px;
	}
`;

export const GIVstreamBottomContainer = styled(BottomContainer)``;

export const GsDataBlock = styled(DataBlock)`
	width: 459px;
`;

export const GsButton = styled(ButtonLink)`
	padding: 24px 34px;
`;

export const FlowRateRow = styled(Flex)`
	margin-top: 48px;
	color: ${neutralColors.gray[100]};
`;

export const FlowRateTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 260px;
`;

export const FlowRateUnit = styled(H4)`
	color: ${brandColors.giv[200]};
`;

export const GIVstreamProgressContainer = styled.div`
	background: ${brandColors.giv[700]};
	border-radius: 8px;
	padding: 28px 33px;
	margin: 40px 0 64px;
`;

export const GsPTitleRow = styled(Flex)``;

export const GsPTitle = styled(Flex)``;

export const GsPTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 240px;
`;
interface IBarProps {
	percentage: number;
}
export const Bar = styled.div<IBarProps>`
	height: 12px;
	width: 100%;

	background: ${brandColors.giv[800]};
	border-radius: 12px;

	position: relative;
	overflow: hidden;

	margin: 24px 0 8px;

	::after {
		content: ' ';
		width: ${props => props.percentage}%;
		left: 0;
		top: 0;
		height: 12px;
		border-radius: 12px;
		background: ${brandColors.cyan[500]};
		position: absolute;
		transition: width 0.3s ease;
	}
`;

export const PercentageRow = styled(Flex)`
	margin-bottom: 5px;
`;

export const IncreaseSection = styled.div`
	margin-top: 54px;
	padding: 60px 0 32px;
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
`;

export const IncreaseSectionTitle = styled(H2)`
	color: ${brandColors.giv[200]};
	margin-bottom: 40px;
`;

export const IGsDataBox = styled(DataBox)`
	height: 387px;
	margin-bottom: 16px;
`;

export const HistoryTitleRow = styled(Flex)`
	margin: 110px 0 40px;
	align-items: center;
	gap: 16px;
`;

export const HistoryTitle = styled(H2)`
	color: ${brandColors.giv[200]};
`;

export const HistoryTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 265px;
`;

export const HistoryContainer = styled.div`
	position: relative;
	margin-bottom: 64px;
`;
export const HistoryLoading = styled.div`
	background-color: ${brandColors.giv[800]}aa;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 40px;
	left: 0;
	bottom: 0;
	z-index: 1;
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 1fr;
	border-bottom: 2px solid ${brandColors.giv[500]};
	& > span {
		padding: 8px 4px;
		// border-left: 1px solid black;
		// border-bottom: 1px solid black;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

export const GsHFrUnit = styled(P)`
	color: ${brandColors.giv[200]};
`;

export const TxHash = styled(GLink)``;

export const TxSpan = styled.span`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;
export const NoData = styled.div`
	text-align: center;
	padding: 20px;
`;
