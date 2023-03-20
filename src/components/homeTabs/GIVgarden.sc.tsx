import styled from 'styled-components';

import {
	H1,
	H3,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
	GLink,
} from '@giveth/ui-design-system';
import { Row } from '@giveth/ui-design-system';
import {
	TopContainer,
	BottomContainer,
	EnhancedRewardCard,
	MobileD1,
} from './commons';
import { device, mediaQueries } from '@/lib/constants/constants';

export const GivGardenSection = styled.div`
	justify-content: space-between;
	align-items: flex-start;
	${mediaQueries.mobileL} {
		display: flex;
		flex-flow: column nowrap;
	}
`;

export const GardenTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
	&::after {
		content: url('/images/flower3.svg');
		position: absolute;
		right: 0;
		bottom: -100px;
		z-index: 0;
	}
`;

export const Left = styled.div`
	/* width: 616px; */
`;

export const Right = styled.div`
	/* width: 360px; */
	position: relative;
	align-self: end;
	&::before {
		content: url('/images/flower1.svg');
		position: absolute;
		left: 0;
		top: -20px;
		z-index: 0;
	}
	&::after {
		content: url('/images/flower2.svg');
		position: absolute;
		left: 230px;
		top: 0;
		z-index: 0;
	}
`;

export const Title = styled(MobileD1)`
	position: relative;
	margin-top: 60px;
	margin-bottom: 24px;
	display: inline-block;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 36px;
	}
`;

export const GardenRewardCard = styled(EnhancedRewardCard)`
	z-index: 1;
	position: relative;
	margin-bottom: 24px;
	${mediaQueries.tablet} {
		margin-bottom: 0;
	}
`;

export const GardenBottomContainer = styled(BottomContainer)``;

export const Section1Title = styled(H3)`
	margin-top: 80px;
	margin-bottom: 24px;
`;

export const Section1Subtitle = styled(QuoteText)`
	/* width: 802px; */
`;

export const OpenGardenButton = styled(Button)`
	width: 251px;
	padding: 24px;
	margin-top: 15px;
`;
export const Section2Title = styled(H1)`
	color: ${brandColors.giv[200]};
	margin-top: 120px;
	margin-bottom: 40px;
`;

export const GovernanceDB = styled(DataBlock)`
	width: 100%;
	display: flex;
	flex-flow: column nowrap;
	align-items: flex-start;
`;

export const GovernanceLink = styled(GLink)`
	color: ${brandColors.cyan[500]};
	padding: 16px 0;
	cursor: pointer;
	font-weight: bold;
	margin-top: auto;
`;

export const GovernanceRaw = styled(Row)`
	margin-bottom: 120px;
`;

export const VoteCard = styled.div`
	background-color: #3c14c5;
	border-radius: 8px;
	padding: 148px 25px 117px 25px;
	display: block;
	background-image: url('/images/backgrounds/giv-outline.svg');
	background-repeat: repeat;
	background-position: top;
	min-height: 480px;
	margin: 80px 0 45px;
	position: relative;
	::before {
		content: url('/images/bee1.svg');
		position: absolute;
		bottom: 30px;
		right: 20px;
	}
	::after {
		content: url('/images/bee2.svg');
		position: absolute;
		top: 30px;
		left: 40px;
	}
	${mediaQueries.tablet} {
		padding: 107px 103px 140px 231px;
		background-image: url('/images/flower4.svg'),
			url('/images/backgrounds/giv-outline.svg');
		background-repeat: no-repeat, repeat;
		background-position: bottom left, top;
	}
`;

export const VoteCardDesc = styled(QuoteText)`
	color: ${brandColors.giv[200]};
	margin-top: 24px;
	margin-bottom: 8px;
`;

export const VoteCardButton = styled(Button)`
	display: block;
	margin: 15px auto 0 0;
	padding: 24px;
	${mediaQueries.tablet} {
		padding: 24px 73px;
	}
`;

export const GardenIconContainer = styled.div`
	position: absolute;
	top: 0;
	right: -72px;
	@media ${device.tablet} {
		top: -30px;
		right: -56px;
	}
	@media ${device.laptopL} {
		top: 0;
		right: -72px;
	}
`;
