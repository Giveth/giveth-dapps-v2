import { brandColors, D1, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Container } from '@giveth/ui-design-system';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { RewardCard } from '../RewardCard';

export const TopContainer = styled(Flex)`
	background-image: url('/images/backgrounds/givup.svg');
	height: auto;
	${mediaQueries.tablet} {
		height: 370px;
	}
`;

export const TopInnerContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

export const BottomContainer = styled.div`
	margin-top: 32px;
`;

export const ExtLinkRow = styled(Flex)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
	gap: 4px;
	:hover {
		color: ${brandColors.cyan[300]};
	}
`;

export const EnhancedRewardCard = styled(RewardCard)`
	border-radius: 8px;
	${mediaQueries.tablet} {
		border-radius: 8px 8px 0 0;
	}
`;

export const ExtLinkCyan = styled(GLink)`
	color: ${brandColors.cyan[500]};
`;

export const NoWrap = styled.span`
	white-space: nowrap;
`;

export const MobileD1 = styled(D1)`
	font-size: 3rem !important;
	${mediaQueries.tablet} {
		font-size: 4rem !important;
	}
	${mediaQueries.laptopS} {
		font-size: 6.69rem !important;
	}
`;
