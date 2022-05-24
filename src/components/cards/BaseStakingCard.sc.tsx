import styled from 'styled-components';
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
import { Flex } from '../styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

export const StakingPoolContainer = styled.div`
	height: 488px;
	border-radius: 8px;
	background: ${brandColors.giv[600]};
	color: ${neutralColors.gray[100]};
	position: relative;
	margin-bottom: 32px;
	padding: 1px 0;
`;
export const StakingPoolExchangeRow = styled(Flex)`
	margin: 16px 16px 0;
	height: 21px;
`;

export const StakingPoolExchange = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

export const SPTitle = styled(Flex)`
	margin-top: 2px;
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
export const FirstDetail = styled(Flex)`
	margin-bottom: 28px;
`;

export const Detail = styled(Flex)`
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

export const StakeButtonsRow = styled(Flex)`
	margin: 16px 0;
	gap: 16px;
`;

export const StakeButton = styled(OulineButton)`
	width: 100%;
`;

export const StakeContainer = styled(Flex)`
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

export const OutOfRangeBadgeContianer = styled(Flex)`
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

export const IconGift = styled.img`
	cursor: pointer;
	width: 20px;
	height: 20px;
`;

export const GiftTooltip = styled.div`
	color: ${neutralColors.gray[100]};
	text-align: center;
	width: 120px;
	font-size: 0.8em;
`;

export const IntroIcon = styled.div`
	cursor: pointer;
	color: ${brandColors.deep[100]};
	transition: color 0.3s ease;
	:hover {
		color: ${neutralColors.gray[100]};
	}
`;

export const DisableModal = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: transparent;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #00000070;
`;

export const DisableModalContent = styled.div`
	display: flex;
	background: white;
	gap: 12px;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	max-width: 80%;
	height: 156px;
	padding: 16px 12px;
`;

export const DisableModalText = styled(P)<{ weight?: number }>`
	color: ${brandColors.giv[500]};
	font-weight: ${props => (props.weight ? props.weight : 400)};
`;

export const DisableModalCloseButton = styled(OulineButton)`
	border: none;
	color: ${brandColors.giv[500]};
	font-weight: 700;
	margin-left: auto;
	padding-right: 4px;

	&:hover {
		background-color: transparent;
	}
`;

export const DisableModalImage = styled.div`
	width: 36px;
	color: ${brandColors.giv[500]};
`;

export const CardTag = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	width: 68px;
	height: 104px;
	border-bottom-left-radius: 28px;
	background-color: ${brandColors.giv[700]};
	padding: 11px;
`;

export const GIVpowerLogoCardTag = styled.div`
	background-color: ${brandColors.pinky[500]};
	border-radius: 16px;
	color: white;
	text-align: center;
	padding: 8px 15px 4px;
	position: absolute;
	bottom: 11px;
`;
