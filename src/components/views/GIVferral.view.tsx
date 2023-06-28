import { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import {
	H3,
	H5,
	Button,
	Lead,
	neutralColors,
	brandColors,
	B,
	Col,
	Container,
	IconLinkedin,
	IconTwitter,
	IconFacebook,
	IconShare,
} from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { EContentType } from '@/lib/constants/shareContent';
import ShareRewardedModal from '@/components/modals/ShareRewardedModal';

const GIVferralView = () => {
	const { formatMessage } = useIntl();
	const [showModal, setShowModal] = useState(false);

	return (
		<Main>
			{showModal && (
				<ShareRewardedModal
					contentType={EContentType.thisProject}
					setShowModal={setShowModal}
				/>
			)}
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
							{formatMessage({
								id: 'label.refer_your_friends_and_earn_giv',
							})}
						</Bold>
					</BannerContent>
					<Flower1 />
					<Flower2 />
				</Banner>
			</Wrapper>
			<Container>
				<Section>
					<FloatingFigure3 />
					<BoxCol>
						<Title>
							{formatMessage({
								id: 'label.when_others_give_you_earn',
							})}
						</Title>
						<LeadText>
							{formatMessage({
								id: 'label.by_encouraging_your_network',
							})}
						</LeadText>
					</BoxCol>
				</Section>

				<ReferralTitle>
					{formatMessage({ id: 'label.how_referrals_work' })}
				</ReferralTitle>

				<Section>
					<CompleteBox>
						<SectionTitle>
							<Dot>
								<B>1</B>
							</Dot>
						</SectionTitle>
						<BoxCol>
							<Subtitle>
								{formatMessage({
									id: 'label.connect_your_wallet_and_generate_your_link',
								})}
							</Subtitle>
							<Content>
								{formatMessage({
									id: 'label.look_for_the_share_and_get_rewarded',
								})}
							</Content>
						</BoxCol>
					</CompleteBox>
					<Bee />
					<Screenshots>
						<Screenshot
							src='/images/givferral/screenshot1.png'
							alt='screenshot1'
						/>
						<Screenshot2
							src='/images/givferral/screenshot2.png'
							alt='screenshot1'
						/>
					</Screenshots>
				</Section>
				{/* <FloatingFigure2 /> */}
				<ReverseSection>
					<SocialItems>
						<SocialCol>
							<SocialButtonContainer>
								<IconTwitter />
								{formatMessage({
									id: 'label.share_on_twitter',
								})}
							</SocialButtonContainer>
							<SocialButtonContainer>
								<IconFacebook />
								{formatMessage({
									id: 'label.share_on_facebook',
								})}
							</SocialButtonContainer>
						</SocialCol>
						<SocialCol>
							<SocialButtonContainer>
								<IconLinkedin />
								{formatMessage({
									id: 'label.share_on_linkedin',
								})}
							</SocialButtonContainer>
							<SocialButtonContainer>
								<IconShare />
								{formatMessage({
									id: 'label.copy_link',
								})}
							</SocialButtonContainer>
						</SocialCol>
					</SocialItems>
					<CompleteBox>
						<SectionTitle>
							<Dot>
								<B>2</B>
							</Dot>
						</SectionTitle>
						<BoxCol>
							<Subtitle>
								{formatMessage({
									id: 'label.share_your_referral_link_with_your_friends',
								})}
							</Subtitle>
							<Content>
								{formatMessage({
									id: 'label.share_on_twitter_linkedin_or_facebook',
								})}
							</Content>
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
							<Subtitle>
								{formatMessage({
									id: 'label.when_someone_donates_using_your_link',
								})}
							</Subtitle>
							<Content>
								{formatMessage({
									id: 'label.your_giv_rewards_become_claimable',
								})}
							</Content>
						</BoxCol>
					</CompleteBox>
					<Image
						src='/images/givferral/share-and-get-giv.svg'
						width={489}
						height={384}
						alt='gift'
						style={{
							marginLeft: '8px',
						}}
					/>
				</Section>
				<Section>
					<BoxCol>
						<Title>
							{formatMessage({ id: 'label.start_referring!' })}
						</Title>
						<LeadText>
							{formatMessage({
								id: 'label.connect_your_wallet_and_get_your_link',
							})}
						</LeadText>
					</BoxCol>
					<LastBoxCol>
						<ShareButton
							size='small'
							label={formatMessage({
								id: 'label.share_and_get_rewarded',
							})}
							buttonType='primary'
							leftIcon={
								<Image
									src='/images/icons/gift_white.svg'
									width={16}
									height={16}
									alt='gift'
									style={{
										marginLeft: '8px',
									}}
								/>
							}
							onClick={() => setShowModal(true)}
						/>
					</LastBoxCol>
					<FloatingFigure4 />
					<FloatingFigure5 />
				</Section>
			</Container>
		</Main>
	);
};

const Main = styled.div`
	background: white;
	padding: 0 0 100px 0;
`;

const Section = styled(Flex)`
	flex-direction: column;
	position: relative;
	margin: 80px 0;
	justify-content: space-between;
	align-items: center;

	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

const Title = styled(H3)`
	margin: 20px 0 0 0;
	font-weight: 700;
	font-size: 41px;
	line-height: 56px;
`;

const ReferralTitle = styled(Title)`
	margin: 150px 0 0 0;
`;

const Subtitle = styled(H5)`
	font-weight: 700;
	font-size: 25px;
	line-height: 38px;
	margin: 0 0 32px 0;
`;

const ReverseSection = styled(Section)`
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

const LeadText = styled(Lead)`
	font-weight: 400;
	font-size: 24px;
	line-height: 150%;
	color: ${neutralColors.gray[900]};
	margin: 16px 0 0 0;
`;

const Content = styled(B)`
	font-weight: 400;
	font-size: 24px;
	border-top: 1px solid ${neutralColors.gray[300]};
	padding: 16px 0 0 0;
`;

const Box = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	text-align: left;
	width: 100%;
	grid-gap: 32px;
	overflow-wrap: break-word;
	${mediaQueries.laptopS} {
		max-width: 360px;
	}
`;

const CompleteBox = styled(Box)`
	justify-content: flex-start;
	align-items: flex-start;
	max-width: 100% !important;
	${mediaQueries.laptopL} {
		max-width: 570px !important;
		flex-direction: row;
	}
`;

const BoxCol = styled(Flex)`
	text-align: left;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	${mediaQueries.desktop} {
		justify-content: flex-start;
	}
`;

const LastBoxCol = styled(BoxCol)`
	width: 100%;
	margin: 50px 0 0 0;
	justify-content: flex-start;
	${mediaQueries.desktop} {
		max-width: 280px;
	}
`;

const Wrapper = styled.div`
	display: flex;
	algin-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	color: ${neutralColors.gray[100]};
	margin: 0 0 100px 0;
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
	min-width: 627px;
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

const SocialButtonContainer = styled(FlexCenter)`
	height: 48px;
	width: 176px;
	min-width: 176px;
	color: ${neutralColors.gray[800]};
	gap: 12px;
	font-weight: 500;
	font-size: 12px;
	line-height: 16px;

	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.7);
	border-radius: 48px;
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
	width: 70px;
	height: 40px;
	background-image: url(/images/givferral/yellow-arc.svg);
	left: 0;
`;

const FloatingFigure3 = styled(FloatingFigure1)`
	display: none;
	width: 180px;
	height: 39px;
	background-image: url(/images/givferral/purple-curve.svg);
	margin: auto;
	margin: -200px 0 0 -120px;
	left: 0;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

const FloatingFigure4 = styled(FloatingFigure1)`
	display: none;
	${mediaQueries.laptopS} {
		margin: 0 50%;
		top: 0;
		display: unset;
	}
`;

const FloatingFigure5 = styled(FloatingFigure1)`
	display: none;
	width: 180px;
	height: 39px;
	background-image: url(/images/givferral/pink-curve.svg);
	right: 0;
	top: -40px;
	${mediaQueries.desktop} {
		display: unset;
	}
`;

const Bee = styled.div`
	display: none;
	position: absolute;
	transform: rotate(60deg);
	top: 5%;
	right: 32%;
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

const SocialItems = styled(Flex)`
	width: 100%;
	justify-content: center;
	align-items: center;
	gap: 21px;
	margin: 40px 0 0 0;
	div:nth-child(1) {
		margin: 20px 0 0 0;
	}
	${mediaQueries.desktop} {
		margin: 120px 0 0 0;
		justify-content: flex-start;
		div:nth-child(1) {
			margin: -40px 0 0 0;
		}
	}
`;

const SocialCol = styled(Col)`
	div:nth-child(2) {
		margin: 50px 0 0 60px;
	}
`;

const Screenshots = styled(Flex)`
	width: 100%;
	position: relative;
	flex-direction: column;
	align-items: center;
	margin: 100px 0 0 0;
	${mediaQueries.desktop} {
		margin: 0;
		align-items: flex-end;
	}
`;

const Screenshot = styled.img`
	object-fit: cover;
	max-width: 300px;
`;

const Screenshot2 = styled(Screenshot)`
	max-width: 350px;
	margin: 20px 200px 0 0;
`;

const ShareButton = styled(Button)`
	margin: 0 0 0 50px;
`;

export default GIVferralView;
