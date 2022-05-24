import styled from 'styled-components';
import {
	brandColors,
	ButtonText,
	D1,
	H1,
	QuoteText,
} from '@giveth/ui-design-system';
import { BottomContainer, TopContainer } from './commons';
import { mediaQueries } from '@/lib/constants/constants';
import { ButtonStyled } from '../GeneralCard.sc';

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
	padding: 76px 60px;
	position: relative;
	text-align: center;
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

export const FeaturesCardBottomText = styled(ButtonText)`
	color: ${brandColors.mustard[500]};
	margin-top: 3px;
`;
