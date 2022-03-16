import { brandColors, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/utils/constants';
import { RewardCard } from '../RewardCard';

export const TabContainer = styled.div``;

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

export const TopContainerRow = styled(Flex)``;
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

export const ExtLink = styled(GLink)``;
