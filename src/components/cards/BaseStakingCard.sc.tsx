import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import {
	brandColors,
	neutralColors,
	Overline,
	H4,
	B,
	P,
	Caption,
	Button,
	OulineButton,
	Subline,
} from '@giveth/ui-design-system';

export const StakingPoolContainer = styled.div`
	width: 383px;
	border-radius: 8px;
	background: ${brandColors.giv[600]};
	color: ${neutralColors.gray[100]};
	position: relative;
	margin-bottom: 32px;
`;
export const StakingPoolExchangeRow = styled(Row)`
	margin: 16px;
`;

export const StakingPoolExchange = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

export const StakingPoolBadge = styled.img`
	position: absolute;
	top: 12px;
	right: 0px;
`;
export const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 24px;
`;

export const StakingPoolLabel = styled(H4)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const Details = styled.div`
	margin: 12px 0;
`;
export const FirstDetail = styled(Row)`
	margin-bottom: 28px;
`;

export const Detail = styled(Row)`
	margin-bottom: 16px;
`;
export const GIVgardenTooltip = styled.div`
	color: ${neutralColors.gray[100]};
	text-align: center;
	width: 120px;
	font-size: 0.8em;
`;
export const DetailLabel = styled(Caption)``;
export const DetailValue = styled(B)``;
export const DetailUnit = styled(P)`
	color: ${brandColors.deep[100]};
`;

export const ClaimButton = styled(Button)`
	width: 100%;
`;

export const StakeButtonsRow = styled(Row)`
	margin: 16px 0;
	gap: 16px;
`;

export const StakeButton = styled(OulineButton)`
	width: 100%;
`;

export const StakeContainer = styled(Row)`
	gap: 6px;
	width: 100%;
`;
export const StakeAmount = styled(Caption)`
	text-align: center;
`;

export const LiquidityButton = styled(Button)`
	width: 100%;
	margin-bottom: 16px;
`;

export const IconContainer = styled.div`
	cursor: pointer;
`;

export const CardDisable = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: #ffffffa0;
`;

export const Return = styled.img`
	background: transparent;
	width: 50px;
	height: 50px;
	position: absolute;
	cursor: pointer;
	top: 0;
	right: 0;
	padding: 16px;
`;

export const OutOfRangeBadgeContianer = styled(Row)`
	padding: 3px 7px;
	background-color: ${brandColors.giv[500]};
	border-radius: 28px;
`;

export const OutOfRangeTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 233px;
	text-align: center;
`;

export const IconHelpWraper = styled.div`
	cursor: pointer;
`;
