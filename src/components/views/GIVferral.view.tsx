import Image from 'next/image';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	H3,
	H4,
	D2,
	Lead,
	Caption,
	neutralColors,
	brandColors,
	ButtonLink,
	Button,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import { isProduction } from '@/configuration';
import { Col, Container, Row } from '@/components/Grid';
import VideoBlock from '@/components/VideoBlock';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';

const GIVferralView = () => {
	const { formatMessage } = useIntl();
	const chainvineURL = isProduction
		? 'https://app.chainvine.xyz/giveth'
		: 'https://staging.chainvine.xyz/giveth-staging';
	return (
		<Container>
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
					<Bee />
					<Flower1 />
					<Flower2 />
				</Banner>
			</Wrapper>
			<Section>
				<H3>
					{formatMessage({ id: 'label.how_to_refer_your_friends' })}
				</H3>
				<Container>
					<Boxes>
						<Box>
							<BigNum>1</BigNum>
							<BoxCol>
								<LeadText>
									{formatMessage({
										id: 'label.go_to_chainvine_and_connect_your_wallet',
									})}
								</LeadText>
								<GoTo
									label={formatMessage({
										id: 'label.go_to_chainvine',
									})}
									linkType='texty-primary'
									isExternal
									href={chainvineURL}
									icon={
										<Image
											alt='outlink'
											src='/images/icons/outlink.svg'
											width={16}
											height={16}
										/>
									}
									target='_blank'
								/>
							</BoxCol>
						</Box>
						<Box>
							<BigNum>2</BigNum>
							<LeadText>
								{formatMessage({
									id: 'label.generate_your_unique_url',
								})}
							</LeadText>
						</Box>
						<Box>
							<BigNum>3</BigNum>
							<LastBox>
								<LeadText>
									{formatMessage({
										id: 'label.earn_giv_tokens_for_each_donation_made_through_your_link',
									})}
								</LeadText>
								<CaptionBox>
									<Caption>
										{formatMessage({
											id: 'label.up_to_10_percent_of_the_total_donation',
										})}
									</Caption>
								</CaptionBox>
							</LastBox>
						</Box>
					</Boxes>
				</Container>
			</Section>
			<Section>
				<CompleteBox>
					<LargeBox>
						<H3>
							{formatMessage({
								id: 'label.when_others_give_you_earn',
							})}
						</H3>
						<LeadText>
							{formatMessage({
								id: 'label.share_your_link_on_your_social_media',
							})}
						</LeadText>
						<LeadText>
							{formatMessage({
								id: 'label.by_encouraging_your_network',
							})}
						</LeadText>
					</LargeBox>
					<Button
						label={formatMessage({ id: 'label.get_started' })}
						buttonType='primary'
						icon={<IconChevronRight16 />}
						onClick={() => window?.open(chainvineURL, '_ blank')}
					/>
				</CompleteBox>
			</Section>
			{/* <Section>
				<FloatingFigure3 />

				<VideoBox>
					<LargeBox>
						<H3>
							{formatMessage({ id: 'label.see_it_in_action' })}
						</H3>
						<H4Text>
							{formatMessage({
								id: 'label.learn_how_to_become_an_active_part',
							})}
						</H4Text>
					</LargeBox>
					<VideoBlock
						src='/video/giveconomy.mp4'
						poster='/video/giveconomy.webp'
					/>
				</VideoBox>
				<FloatingFigure1 />
				<FloatingFigure2 />
			</Section> */}
		</Container>
	);
};

const Section = styled(Col)`
	margin: 100px 0;
	h3 {
		margin: 0 0 30px 0;
		font-weight: 700;
		font-size: 41px;
		line-height: 56px;
	}
	${mediaQueries.desktop} {
		h3 {
			margin: 0 0 10px 0;
		}
	}
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
		align-items: center;
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

const LastBox = styled(BoxCol)`
	padding: 40px 0 0 0;
`;

const Boxes = styled(Row)`
	width: 100%;
	margin: 100px 0 0 0;
	grid-gap: 30px;
	justify-content: space-between;
	${mediaQueries.tablet} {
		margin: 0;
	}
`;

const BigNum = styled(D2)`
	color: ${brandColors.giv[500]};
`;

const Wrapper = styled.div`
	display: flex;
	algin-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	margin: 150px 0 0 0;
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
	margin-top: 0;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

const Banner = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	max-width: 1220px;
	position: relative;
	height: 385px;
	border-radius: 20px;
	background: url(/images/givferral/giv-bg.png),
		linear-gradient(252.18deg, #211985 21.35%, #5326ec 67.37%);
	z-index: 0;
	padding-right: 0;

	${mediaQueries.desktop} {
		padding-right: 12%;
	}
`;

const BannerContent = styled(Col)`
	width: 100%;
	padding: 20px;
	z-index: 2;
	${mediaQueries.tablet} {
		max-width: 527px;
	}
	${mediaQueries.desktop} {
		max-width: 627px;
	}
`;

const Bold = styled(H3)`
	font-weight: 700;
`;

const Flower1 = styled.div`
	display: none;
	position: absolute;
	right: 5%;
	bottom: 0;
	background-image: url(/images/givferral/flowers.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 180px;
	z-index: 1;
	${mediaQueries.desktop} {
		display: unset;
	}
`;

const Flower2 = styled.div`
	display: none;
	position: absolute;
	right: 10%;
	bottom: 0;
	background-image: url(/images/givferral/flowers-tiny.svg);
	background-repeat: no-repeat;
	object-fit: contain;
	width: 83px;
	height: 100px;
	z-index: 1;
	${mediaQueries.laptopL} {
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

const GoTo = styled(ButtonLink)`
	justify-content: flex-start;
	padding: 15px 0;
	:hover {
		background: transparent;
		color: ${brandColors.pinky[500]};
	}
`;

const CaptionBox = styled.div`
	background: ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 8px 16px;
	gap: 10px;
	margin: 16px 0;
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
	margin-top: 20px;
	left: 45%;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

export default GIVferralView;
