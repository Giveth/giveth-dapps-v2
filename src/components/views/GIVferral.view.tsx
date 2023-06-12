// import Image from 'next/image';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	H3,
	H4,
	H5,
	Lead,
	neutralColors,
	brandColors,
	ButtonLink,
	Button,
	B,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import { Col, Container } from '@giveth/ui-design-system';
import { isProduction } from '@/configuration';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';

const GIVferralView = () => {
	const { formatMessage } = useIntl();
	const chainvineURL = isProduction
		? 'https://app.chainvine.xyz/giveth'
		: 'https://staging.chainvine.xyz/giveth-staging';
	return (
		<>
			<Wrapper>
				<Banner>
					<Hands />
					<BannerContent>
						<H3>
							{formatMessage({
								id: 'label.givferral_rewards_program',
							})}
						</H3>
						<Bold>
							{formatMessage({ id: 'label.refer_a_friend' })}
						</Bold>
					</BannerContent>
					<Flower1 />
					<Flower2 />
				</Banner>
			</Wrapper>
			<Container>
				<Section>
					<FloatingFigure3 />
					<H3>
						{' '}
						{formatMessage({
							id: 'label.when_others_give_you_earn',
						})}
					</H3>
					<Container>
						<LeadText>
							By encouraging your network to give to good causes,
							you’re not only making a positive impact but also
							earning rewards for your efforts!
						</LeadText>
					</Container>
				</Section>
				<Section>
					<H3>How referrals work</H3>
					<CompleteBox>
						<SectionTitle>
							<Dot>
								<B>1</B>
							</Dot>
						</SectionTitle>
						<BoxCol>
							<H5>
								Connect your wallet and generate your unique
								referral link.
							</H5>
							<B>
								Look for the "Share & get rewarded" button to
								generate links to specific pages across the
								Giveth site.
							</B>
						</BoxCol>
						<Button
							label={formatMessage({ id: 'label.get_started' })}
							buttonType='primary'
							icon={<IconChevronRight16 />}
							onClick={() =>
								window?.open(chainvineURL, '_ blank')
							}
						/>
					</CompleteBox>
				</Section>
				<ReverseSection>
					<BoxCol> - </BoxCol>
					<CompleteBox>
						<SectionTitle>
							<Dot>
								<B>2</B>
							</Dot>
						</SectionTitle>
						<BoxCol>
							<H5>
								Share your referral link with your friends,
								family, and community.
							</H5>
							<B>
								Share on Twitter, LinkedIn or Facebook, or copy
								your link to share anywhere!
							</B>
						</BoxCol>
					</CompleteBox>
				</ReverseSection>
				<Section>
					<CompleteBox>
						<SectionTitle>
							<Dot>
								<B>3</B>
							</Dot>
						</SectionTitle>
						<BoxCol>
							<H5>
								When someone donates to a verified project via
								your link, you’ll earn GIV!
							</H5>
							<B>
								Your GIV rewards become claimable within two
								weeks from our GIVbacks page.
							</B>
						</BoxCol>
					</CompleteBox>
					<FloatingFigure1 />
					<FloatingFigure2 />
				</Section>
			</Container>
		</>
	);
};

const Section = styled(Col)`
	position: relative;
	margin: 100px 0;
`;

const ReverseSection = styled(Section)`
	display: flex;
	flex-direction: row !important;
	justify-content: space-between;
`;

const LeadText = styled(Lead)`
	font-weight: 400;
	font-size: 24px;
	line-height: 150%;
	color: ${neutralColors.gray[900]};
`;

const H4Text = styled(H4)`
	line-height: -0.01em;
	max-width: 467px;
	color: ${neutralColors.gray[800]};
	font-weight: 400;
	font-size: 32px;
`;

const Box = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	text-align: left;
	max-width: 360px;
	grid-gap: 32px;
	overflow-wrap: break-word;
`;

const CompleteBox = styled(Box)`
	flex-direction: column;
	justify-content: space-between;
	max-width: 100%;
	align-items: flex-start;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const VideoBox = styled(CompleteBox)``;

const BoxCol = styled(Flex)`
	width: 100%;
	text-align: left;
	flex-direction: column;
`;

const LargeBox = styled(BoxCol)`
	max-width: 913px;
`;

const Wrapper = styled.div`
	display: flex;
	algin-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	margin: 40px 0 0 0;
	color: ${neutralColors.gray[100]};
`;

const Hands = styled.div`
	display: none;
	position: absolute;
	left: 0;
	border-radius: 20px;
	background-image: url(/images/givferral/hands.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 477px;
	height: 100%;
	z-index: 1;
	margin: 0 0 0 -20px;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

const Banner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	position: relative;
	height: 385px;
	background: url(/images/givferral/giv-bg.png),
		linear-gradient(252.18deg, #211985 21.35%, #5326ec 67.37%);
	z-index: 0;
`;

const BannerContent = styled(Col)`
	padding: 20px;
	z-index: 2;
	text-align: left;
	width: 627px;
`;

const Bold = styled(H3)`
	font-weight: 700;
`;

const Flower1 = styled.div`
	display: none;
	position: absolute;
	right: 5%;
	top: 0;
	rotate: 180deg;
	background-image: url(/images/givferral/flowers.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 180px;
	z-index: 1;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const Flower2 = styled.div`
	display: none;
	position: absolute;
	top: 0;
	rotate: 180deg;
	background-image: url(/images/givferral/flowers-tiny.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 100px;
	z-index: 1;
	${mediaQueries.tablet} {
		display: unset;
		right: 15%;
	}
	${mediaQueries.laptopS} {
		right: 11%;
	}
`;

const GoTo = styled(ButtonLink)`
	justify-content: flex-start;
	padding: 15px 0;
	:hover {
		background: transparent;
		color: ${brandColors.pinky[500]};
	}
`;

const FloatingFigure1 = styled.div`
	display: none;
	position: absolute;
	background-image: url(/images/givferral/pink-figure.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 31px;
	height: 29px;
	z-index: 1;
	${mediaQueries.laptopS} {
		display: unset;
		margin-top: 10px;
		margin-left: 40px;
	}
`;

const FloatingFigure2 = styled(FloatingFigure1)`
	margin-top: 10px;
	left: 70%;
	background-image: url(/images/givferral/purple-figure.svg);
	${mediaQueries.desktop} {
		margin-top: 50px;
	}
`;

const FloatingFigure3 = styled(FloatingFigure1)`
	display: none;
	width: 180px;
	height: 39px;
	background-image: url(/images/givferral/purple-curve.svg);
	margin: auto;
	margin: -50px 0 0 -50px;
	left: 0;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

const Bee = styled.div`
	display: none;
	position: absolute;
	transform: rotate(60deg);
	top: 5%;
	right: 40%;
	bottom: 0;
	background-image: url(/images/bee1.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 180px;
	${mediaQueries.desktop} {
		display: unset;
	}
`;

const SectionTitle = styled(Flex)`
	align-items: center;
	gap: 4px;
`;

const Dot = styled.div`
	width: 24px;
	height: 24px;
	padding: 12px;
	background-color: ${brandColors.giv[500]};
	border: 4px solid ${brandColors.giv[100]}};
	border-radius: 50%;
	color: white;
	font-size: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 20px 0 0 0;
`;

export default GIVferralView;
