import styled from 'styled-components';
import {
	brandColors,
	ButtonText,
	D1,
	H1,
	H2,
	H3,
	QuoteText,
} from '@giveth/ui-design-system';
import { BottomContainer, TopContainer } from './commons';
import { mediaQueries } from '@/lib/constants/constants';
import { ButtonStyled } from '../GeneralCard.sc';
import { Arc } from '../styled-components/Arc';

export const GIVpowerTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;
export const GIVpowerBottomContainer = styled(BottomContainer)``;

export const Title = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 89px;
	}
`;

export const LearnMoreButton = styled(ButtonStyled)`
	margin: 0;
	margin-right: 0;
`;

export const HeadingSectionContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;

	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

export const HeadingTextContainer = styled.div`
	${mediaQueries.desktop} {
		width: 66%;
		margin-right: auto;
	}
`;

export const FeaturesCardContainer = styled.div`
	background-color: #3c14c5;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	min-height: 480px;
	margin: 80px 0 45px;
	padding: 26px 20px;
	position: relative;
	text-align: center;
	${mediaQueries.tablet} {
		padding: 76px 60px;
	}
`;
export const FeaturesCardHeading = styled(H1)`
	text-align: center;
`;

export const FeaturesCardSubheading = styled(QuoteText)`
	max-width: 750px;
	margin: auto;
	margin-top: 8px;
`;

export const FeaturesCardItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 60px;
	gap: 40px;
	${mediaQueries.desktop} {
		flex-direction: row;
		justify-content: space-between;
		gap: 20px;
		margin-top: 106px;
	}
`;

export const FeaturesCardItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	max-width: 300px;
	margin: auto;
`;

export const CardBottomText = styled(ButtonText)`
	color: ${brandColors.mustard[500]};
	margin-top: 3px;
`;

export const CenteredHeader = styled(H2)`
	text-align: center;
`;

export const BenefitsCardsContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 20px 0px;

	${mediaQueries.laptop} {
		gap: 20px;
		flex-direction: row;
	}
`;

export const BenefitsCard = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 30px;
	text-align: center;
	background-color: #4c32e3;
	border-radius: 8px;
	position: relative;
	margin-top: 30px;
	overflow: hidden;
	background-image: url('/images/backgrounds/giv-outlined-bright-opacity.png');
	${mediaQueries.tablet} {
		padding: 60px;
	}
	${mediaQueries.desktop} {
		display: row;
		width: 50%;
	}
`;

export const BenefitsCardTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin: auto;
	${mediaQueries.desktop} {
		display: row;
		width: 50%;
		width: 360px;
	}
`;

export const BenefitsCardHeading = styled(H3)`
	margin-bottom: 40px;
`;

export const ArcMustardTop = styled(Arc)`
	border-color: ${brandColors.mustard[500]} ${brandColors.mustard[500]}
		transparent transparent;
	width: 600px;
	height: 600px;
	border-width: 50px;
	transform: rotate(-45deg);
	top: -100px;
	right: -300px;
	display: none;
	${mediaQueries.laptop} {
		top: 0px;
		display: unset;
	}
	z-index: 0;
`;
export const ArcMustardBottom = styled(Arc)`
	border-color: ${brandColors.cyan[500]} ${brandColors.cyan[500]} transparent
		transparent;
	width: 600px;
	height: 600px;
	border-width: 50px;
	transform: rotate(-224deg);
	left: -300px;
	display: none;
	${mediaQueries.laptop} {
		bottom: -25px;
		display: unset;
	}
	z-index: 0;
`;
