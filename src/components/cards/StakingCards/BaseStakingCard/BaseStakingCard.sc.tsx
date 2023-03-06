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
	OutlineButton,
	Subline,
} from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';

export const StakingPoolContainer = styled.div`
	height: 542px;
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
	text-transform: uppercase;
`;

export const SPTitle = styled(Flex)`
	margin-top: 2px;
	margin-bottom: 36px;
`;

export const StakingPoolLabel = styled(H4)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const Details = styled(Flex)`
	flex-direction: column;
	gap: 16px;
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
	margin-top: 16px;
	gap: 16px;
`;

export const StakeButton = styled(OutlineButton)`
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
	margin-top: 8px;
	width: 100%;
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
	text-align: left;
`;

export const AngelVaultTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	// TODO: until we merge the new tooltip to and can align it.
	width: 220px;
	text-align: left;
`;

export const IconHelpFilledWrapper = styled.div`
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

export const LockInfoTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 180px;
`;

export const GIVgardenTooltip = styled.div`
	color: ${neutralColors.gray[100]};
	text-align: center;
	width: 150px;
	font-size: 0.8em;
`;

export const HarvestButtonsWrapper = styled(Flex)`
	margin-top: 32px;
	flex-direction: column;
	height: 112px;
	gap: 16px;
	justify-content: center;
`;
