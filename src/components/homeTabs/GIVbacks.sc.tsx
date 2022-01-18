import styled from 'styled-components';

import {
	D1,
	H1,
	H2,
	H5,
	P,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
	GLink,
	neutralColors,
	Title,
	ButtonLink,
} from '@giveth/ui-design-system';
import { TopContainer } from './commons';
import { RewardCard } from '../RewardCard';
import { Row } from '../styled-components/Grid';

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

export const GBTitle = styled(D1)`
	margin-bottom: 24px;
`;

export const GBSubtitle = styled(QuoteText)``;

export const GIVbackRewardCard = styled(RewardCard)``;

export const GIVbacksBottomContainer = styled.div``;

export const GbDataBlock = styled(DataBlock)`
	width: 460px;
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

export const RoundSection = styled(Row)`
	flex-direction: column;
	align-content: stretch;
	color: ${brandColors.giv[200]};
`;

export const RoundTitle = styled(H2)`
	margin: 22px 0;
`;

export const RoundInfo = styled.div`
	margin: 38px 64px 32px 0;
`;

export const RoundInfoRow = styled(Row)`
	margin: 14px 0;
`;

export const RoundInfoTallRow = styled(Row)`
	margin: 32px 0;
`;

export const GivAllocated = styled(Title)`
	color: ${neutralColors.gray[100]};
`;

export const RoundButton = styled(Button)`
	padding: 16px 55px;
`;

export const InfoSection = styled.div`
	width: 433px;
`;

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
