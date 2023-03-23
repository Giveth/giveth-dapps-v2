import styled from 'styled-components';

import { QuoteText, brandColors } from '@giveth/ui-design-system';
import { Row } from '@giveth/ui-design-system';
import {
	BottomContainer,
	EnhancedRewardCard,
	MobileD1,
	TopContainer,
} from './commons';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

export const GIVfarmTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;
export const GIVfarmBottomContainer = styled(BottomContainer)``;

export const Title = styled(MobileD1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 89px;
	}
`;

export const GIVfarmRewardCard = styled(EnhancedRewardCard)`
	margin-bottom: 24px;
	${mediaQueries.tablet} {
		margin-bottom: 0;
	}
`;

export const GIVfarmToolBoxRow = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export const PoolRow = styled(Row)`
	align-items: center;
	margin-top: 24px;
	margin-bottom: 24px;
`;

export const ContractRow = styled(Flex)`
	gap: 8px;
`;

export const CopyWrapper = styled.div`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
	:hover {
		color: ${brandColors.cyan[300]};
	}
`;
