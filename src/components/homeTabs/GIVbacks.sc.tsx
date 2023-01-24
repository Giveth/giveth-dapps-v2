import styled from 'styled-components';

import {
	H2,
	H5,
	P,
	QuoteText,
	DataBlock,
	brandColors,
	GLink,
	neutralColors,
	Title,
	ButtonLink,
} from '@giveth/ui-design-system';
import {
	BottomContainer,
	EnhancedRewardCard,
	MobileD1,
	TopContainer,
} from './commons';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

export const GIVbacksTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;

export const Left = styled.div`
	align-self: start;
`;

export const Right = styled.div`
	align-self: end;
`;

export const GBTitle = styled(MobileD1)`
	margin-bottom: 24px;
`;

export const GBSubtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 64px;
	}
`;

export const GIVbackRewardCard = styled(EnhancedRewardCard)``;

export const GIVbacksBottomContainer = styled(BottomContainer)``;

export const GbDataBlock = styled(DataBlock)`
	min-height: 285px;
	display: flex;
	flex-flow: column nowrap;
	align-items: flex-start;
	margin-bottom: 16px;
`;

export const GbButton = styled(ButtonLink)`
	padding: 24px 31px;
	margin-top: auto;
`;

export const GIVBackCard = styled.div`
	margin: 132px 0 41px;
	background-color: #3c14c5;
	padding: 50px;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	min-height: 480px;
	position: relative;
`;

export const RoundSection = styled(Flex)`
	flex-direction: column;
	align-content: stretch;
	color: ${brandColors.giv[200]};
`;

export const RoundTitle = styled(H2)`
	margin: 22px 0;
	font-size: 3rem;
	${mediaQueries.mobileL} {
		font-size: 3.25rem;
	}
`;

export const RoundInfo = styled.div`
	margin: 38px 64px 32px 0;
`;

export const RoundInfoRow = styled(Flex)`
	margin: 14px 0;
`;

export const RoundInfoTallRow = styled(Flex)`
	margin: 32px 0;
`;

export const GivAllocated = styled(Title)`
	color: ${neutralColors.gray[100]};
	font-size: 25px;
	${mediaQueries.tablet} {
		font-size: 32px;
	}
`;

export const RoundButton = styled(ButtonLink)`
	padding: 16px 55px;
`;

export const InfoSection = styled.div``;

export const InfoImage = styled.img`
	height: 103px;
	width: 216px;
	margin: 0 auto;
	display: block;
`;

export const InfoTitle = styled(H5)`
	margin: 44px 0 16px;
`;

export const InfoDesc = styled(P)`
	margin-bottom: 22px;
	margin-right: 33px;
`;

export const InfoReadMore = styled(GLink)`
	color: ${brandColors.cyan[500]};
`;
