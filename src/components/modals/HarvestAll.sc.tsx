import {
	brandColors,
	neutralColors,
	P,
	Lead,
	Button,
	H6,
	Caption,
	Subline,
	B,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';

import { Flex } from '../styled-components/Flex';

export const HarvestAllModalContainer = styled.div`
	width: 100%;
	min-height: 100px;
	${mediaQueries.tablet} {
		width: 686px;
	}
`;

export const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

export const HelpRow = styled(Flex)`
	gap: 8px;
	margin-bottom: 4px;
`;

export const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

export const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

export const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const HarvestAllDesc = styled(P)`
	text-align: justify;
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
	border: 1px solid ${brandColors.mustard[700]};
	padding: 18px 16px;
	margin: 28px 0 12px;
`;

export const NothingToHarvest = styled(H6)`
	text-align: center;
	color: ${neutralColors.gray[100]};
	margin-bottom: 32px;
`;

export const Pending = styled(Flex)`
	margin: 0 auto 16px;
	width: 100%;
	line-height: 50px;
	height: 50px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 0 !important;
	}
`;

export const HarvestAllPending = styled(Pending)`
	max-width: 316px;
`;

export const TooltipContent = styled(Subline)`
	${mediaQueries.tablet} {
		width: 200px;
	}
`;

export const HarvestBoxes = styled.div`
	padding: 24px;
`;

export const BreakdownTableTitle = styled(B)`
	color: ${brandColors.deep[100]};
	text-align: left;
`;

export const BreakdownTableBody = styled.div`
	margin-bottom: 48px;
	overflow-x: auto;
`;

export const BreakdownRow = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr 1fr 1fr 1.5fr;
	border-bottom: 2px solid ${brandColors.giv[500]};
	padding: 16px;
	min-width: 480px;
`;

export const BreakdownIcon = styled.div``;
export const BreakdownTitle = styled(Flex)`
	gap: 8px;
	align-items: center;
`;
export const BreakdownAmount = styled(B)`
	text-align: right;
`;
export const BreakdownRate = styled(B)`
	text-align: right;
`;
export const BreakdownUnit = styled(P)`
	color: ${brandColors.giv[200]};
	display: inline-block;
	padding-left: 4px;
	text-align: left;
	display: flex;
	gap: 8px;
`;

export const GIVbackStreamDesc = styled(Caption)`
	grid-column-start: 1;
	grid-column-end: 4;
	text-align: right;
	color: ${brandColors.deep[100]};
`;

export const BreakdownSumRow = styled(BreakdownRow)`
	border: none;
	align-items: center;
`;

export const BreakdownLiquidSum = styled(B)`
	text-align: right;
	font-size: 24px;
`;
export const BreakdownStreamSum = styled(Flex)`
	& > div {
		font-size: 20px;
		line-height: 24px;
	}
`;

export const PoolIcon = styled.div`
	width: 16px;
	height: 16px;
`;

export const RateRow = styled(Flex)`
	gap: 4px;
	margin-bottom: 32px;
`;
