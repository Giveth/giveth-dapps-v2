import styled from 'styled-components';
import {
	brandColors,
	Button,
	ButtonLink,
	ButtonText,
	Caption,
	Container,
	H1,
	H2,
	H3,
	OutlineLinkButton,
	P,
	QuoteText,
} from '@giveth/ui-design-system';
import { BottomContainer, MobileD1, TopContainer } from './commons';
import { mediaQueries } from '@/lib/constants/constants';
import { Arc } from '../styled-components/Arc';
import { Flex } from '../styled-components/Flex';

export const GIVpowerContainer = styled(Container)`
	padding: 16px;
	${mediaQueries.laptopS} {
		padding: 16px 32px;
	}
`;

export const GIVpowerTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;
export const GIVpowerBottomContainer = styled(BottomContainer)``;

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

export const LearnMoreButton = styled(ButtonLink)`
	width: 250px;
`;

export const HeadingSectionContainer = styled(Flex)`
	flex-direction: column;
	gap: 20px;
	align-items: center;

	${mediaQueries.desktop} {
		flex-direction: row;
		align-items: flex-end;
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
	padding: 32px 20px;
	position: relative;
	text-align: center;
	z-index: 1;
	${mediaQueries.tablet} {
		padding: 50px 5px;
	}
	${mediaQueries.laptopS} {
		padding: 76px 30px;
	}
`;
export const FeaturesCardHeading = styled(H1)`
	text-align: center;
`;

export const FeaturesCardSubheading = styled(QuoteText)`
	max-width: 750px;
	margin: 8px auto;
`;

export const FeaturesCardItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 60px;
	gap: 40px;
	${mediaQueries.tablet} {
		flex-direction: row;
		justify-content: space-between;
		gap: 0;
		margin-top: 106px;
	}
	${mediaQueries.laptopS} {
		gap: 20px;
	}
`;

export const FeaturesCardItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	max-width: 300px;
	margin: auto;
	align-items: center;
`;

export const CardBottomText = styled(ButtonText)`
	color: ${brandColors.mustard[500]};
	margin: 3px auto 0;
	text-transform: uppercase;
`;

export const CenteredHeader = styled(H2)`
	text-align: center;
`;

export const BenefitsCardsContainer = styled.div`
	display: flex;

	flex-direction: column;

	padding-bottom: 60px;
	${mediaQueries.laptopS} {
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
	background-color: #5326ec;
	border-radius: 8px;
	position: relative;
	margin-top: 30px;
	overflow: hidden;
	background-image: url('/images/backgrounds/giv-outlined-bright-opacity.png');
	${mediaQueries.tablet} {
		padding: 60px;
	}
	${mediaQueries.desktop} {
		width: 50%;
	}
`;

export const BenefitsCardContainer = styled(Flex)`
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
`;

export const BenefitsCardTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin: auto;
	${mediaQueries.desktop} {
		width: 360px;
	}
`;

export const HeaderAndCirclesContainer = styled.div`
	position: relative;
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
	${mediaQueries.laptopS} {
		top: 0;
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
	${mediaQueries.laptopS} {
		bottom: 30px;
		display: unset;
	}
	z-index: 0;
`;
export const Circle = styled.div<{ size: number }>`
	position: absolute;
	border-radius: 50%;
	border-style: solid;
	border-width: 2px;
	width: ${props => props.size / 4}px;
	height: ${props => props.size / 4}px;
	border-color: ${brandColors.giv[200]};
	opacity: 0.1;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 0;
	overflow: hidden;
	${mediaQueries.mobileL} {
		width: ${props => props.size / 3.2}px;
		height: ${props => props.size / 3.2}px;
	}
	${mediaQueries.tablet} {
		width: ${props => props.size / 2}px;
		height: ${props => props.size / 2}px;
	}
	${mediaQueries.laptopS} {
		width: ${props => props.size / 1.3}px;
		height: ${props => props.size / 1.3}px;
	}
	${mediaQueries.desktop} {
		width: ${props => props.size}px;
		height: ${props => props.size}px;
	}
`;
export const BoostLinkContainer = styled.div`
	margin-bottom: 10px;
`;

export const CaptionStyled = styled(Caption)`
	text-align: center;
	margin-top: -16px;
`;

export const GivpowerCTAContainer = styled.div`
	background-image: url('/images/backgrounds/giv-outline.svg');
	width: 100%;
	padding: 20px 0;
	text-align: center;
	${mediaQueries.tablet} {
		padding: 40px 0;
	}
`;

export const GivpowerCTASubheading = styled(QuoteText)`
	color: ${brandColors.giv[200]};
	margin-top: 8px;
	margin-bottom: 16px;
`;

export const GivpowerCTAButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 16px;
	margin-top: 40px;
	flex-direction: column;
	${mediaQueries.mobileM} {
		flex-direction: row;
	}
`;
export const GivpowerCTAButton = styled(ButtonLink)`
	width: 250px;
	margin: 0 auto;
	${mediaQueries.tablet} {
		margin: 0;
	}
`;

export const GivpowerCTAButtonOutlined = styled(OutlineLinkButton)`
	width: 250px;
	margin: 0 auto;
	${mediaQueries.tablet} {
		margin: 0;
	}
`;

export const BoostProjectButton = styled(ButtonLink)`
	margin: 8px auto 10px;
	min-width: 250px;
	${mediaQueries.tablet} {
		margin: 8px 0 0;
		min-width: unset;
		* {
			font-size: 0.8rem;
		}
	}
	${mediaQueries.laptopS} {
		min-width: 250px;
		* {
			font-size: 1rem;
		}
	}
`;

export const GivPowerCardContainer = styled.div`
	background: ${brandColors.giv[700]};
	padding: 24px;
	margin-bottom: 8px;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	${mediaQueries.tablet} {
		margin-bottom: 0;
		padding-bottom: 40px;
	}
	${mediaQueries.laptopS} {
		padding-bottom: 24px;
	}
`;

// remove margin when boosting deployment goes to production
export const GivAmount = styled(Flex)`
	align-items: baseline;
	gap: 16px;
	margin-bottom: 16px;
`;

export const ConnectWallet = styled.div`
	/* padding: 12px; */
`;

export const ConnectWalletDesc = styled(P)`
	padding: 24px;
	margin-bottom: 12px;
	text-align: center;
	color: ${brandColors.deep[100]};
`;

export const ConnectWalletButton = styled(Button)`
	margin: auto;
`;
