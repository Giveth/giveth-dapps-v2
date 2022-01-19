import React, { useState } from 'react';
import Image from 'next/image';
import ProjectCard from '@/components/project-card/ProjectCardAlt';
import CryptoDonation from './CryptoDonation';
import FiatDonation from './FiatDonation';
import { IProjectBySlug } from '@/apollo/types/types';
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
} from 'react-share';
import { BigArc } from '@/components/styled-components/Arc';
import ArrowLeft from '/public/images/arrow_left.svg';
import RadioOnIcon from '/public/images/radio_on.svg';
import RadioOffIcon from '/public/images/radio_off.svg';
import {
	H4,
	brandColors,
	P,
	Lead,
	neutralColors,
	H6,
	Subline,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';

const CRYPTO_DONATION = 'Cryptocurrency';
const FIAT_DONATION = 'Credit Card';

const ProjectsIndex = (props: IProjectBySlug) => {
	const { project } = props;
	const [donationType, setDonationType] = useState(CRYPTO_DONATION);
	const [isSuccess, setSuccess] = useState<boolean>(false);

	const shareTitle =
		'I am a Giver and you can be one too! 💙 @givethio. Let’s Build the Future of Giving together! 🙌 🌈 #maketheworldabetterplace 🌏 💜';
	const url = typeof window !== 'undefined' ? window?.location?.href : null;

	const TypeSelection = () => {
		const RadioOn = () => <Image src={RadioOnIcon} alt='radio on' />;
		const RadioOff = () => <Image src={RadioOffIcon} alt='radio off' />;

		const RadioTitle = (props: { type: string }) => {
			const isTypeSelected = props.type === donationType;
			return (
				<>
					<RadioTitleBox
						onClick={() =>
							setDonationType(
								props.type === CRYPTO_DONATION
									? CRYPTO_DONATION
									: FIAT_DONATION,
							)
						}
					>
						{props.type === donationType ? (
							<RadioOn />
						) : (
							<RadioOff />
						)}
						<div style={{ marginLeft: '16px' }}>
							<RadioTitleText isSelected={isTypeSelected}>
								{props.type}
							</RadioTitleText>
							<RadioSubtitleText isSelected={isTypeSelected}>
								{props.type === CRYPTO_DONATION
									? 'Zero Fees'
									: 'Bank Fees'}
							</RadioSubtitleText>
						</div>
					</RadioTitleBox>
				</>
			);
		};

		return (
			<>
				<RadioBox>
					<RadioTitle type={CRYPTO_DONATION} />
					<RadioTitle type={FIAT_DONATION} />
				</RadioBox>
				{donationType === CRYPTO_DONATION ? (
					<CryptoDonation
						project={project}
						setSuccessDonation={() => setSuccess(true)}
					/>
				) : (
					<FiatDonation
						project={project}
						setSuccessDonation={() => setSuccess(true)}
					/>
				)}
			</>
		);
	};

	const SuccessView = () => {
		return (
			<SucceessContainer>
				<H4 color={semanticColors.jade[500]}>Successfully donated</H4>
				<Image
					src='/images/motivation.svg'
					alt='motivation'
					width='121px'
					height='121px'
				/>
				<SuccessMessage color={brandColors.deep[900]}>
					We have received your donation, you can see this project on
					your account under the Donated projects and follow the
					project updates there or take a shortcut here. Go to
				</SuccessMessage>
				<P color={brandColors.deep[900]}>Go to</P>
				<Options>
					<GLink>Check project updates</GLink>
					<GLink>Your account</GLink>
				</Options>
			</SucceessContainer>
		);
	};

	return (
		<>
			<BigArc />
			<Wrapper>
				<TitleBox>
					<Image src={ArrowLeft} alt='arrow left' />
					<Title>{project.title}</Title>
				</TitleBox>

				<Sections>
					<Left>
						<ProjectCard key={project.id} project={project} />
					</Left>
					<Right>
						{isSuccess ? (
							<SuccessView />
						) : (
							<>
								<H4>Donate With</H4>
								<TypeSelection />
							</>
						)}
					</Right>
				</Sections>
				<Social>
					<Lead>Can’t donate? Share this page instead.</Lead>
					<SocialItems>
						<SocialItem>
							<TwitterShareButton
								title={shareTitle}
								url={url || ''}
								hashtags={['Giveth']}
							>
								<Image
									src={'/images/social-tw.svg'}
									alt='tw'
									width='44px'
									height='44px'
								/>
							</TwitterShareButton>
						</SocialItem>
						<SocialItem>
							<LinkedinShareButton
								title={shareTitle}
								summary={project?.description}
								url={url || ''}
							>
								<Image
									src={'/images/social-linkedin.svg'}
									alt='lin'
									width='44px'
									height='44px'
								/>
							</LinkedinShareButton>
						</SocialItem>
						<SocialItem>
							<FacebookShareButton
								quote={shareTitle}
								url={url || ''}
								hashtag='#Giveth'
							>
								<Image
									src={'/images/social-fb.svg'}
									alt='fb'
									width='44px'
									height='44px'
								/>
							</FacebookShareButton>
						</SocialItem>
					</SocialItems>
				</Social>
			</Wrapper>
		</>
	);
};

const Social = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 24px 0;
	align-items: center;
`;
const SocialItems = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
	margin: 8px 0 0 0;
`;
const SocialItem = styled.div`
	cursor: pointer;
	padding: 0 12px;
`;
const TitleBox = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer !important;
	margin-bottom: 26px;
	min-width: 400px;
`;
const Wrapper = styled.div`
	text-align: center;
	margin: 60px 194px;
	align-items: center;
`;
const Sections = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(500px, 1fr));
	grid-auto-rows: minmax(100px, auto);
	height: 525px;
`;
const Left = styled.div`
	display: grid;
	justify-content: center;
	grid-auto-flow: column;
	align-content: center;
	z-index: 1;
	grid-column: 1 / 2;
	grid-row: 1;
	background: ${neutralColors.gray[200]};
	padding: 29px 0;
`;
const Right = styled.div`
	z-index: 1;
	grid-row: 1;
	background: white;
	text-align: left;
	padding: 65px 32px 32px;
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
`;
const Title = styled(H6)`
	margin-left: 30.67px;
	span {
		color: ${neutralColors.gray[700]};
	}
`;
const RadioTitleText = styled(Lead)`
	color: ${(props: { isSelected: boolean }) =>
		props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`;
const RadioSubtitleText = styled(Subline)`
	color: ${(props: { isSelected: boolean }) =>
		props.isSelected ? brandColors.deep[900] : neutralColors.gray[600]};
`;
const RadioBox = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-top: 29px;
	margin-bottom: 40px;
	div:first-child {
		margin-right: 32px;
	}
`;
const RadioTitleBox = styled.div`
	display: flex;
	flex-direction: row;
	cursor: pointer;
`;
const SucceessContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	height: 400px;
`;
const SuccessMessage = styled(P)`
	margin: 20px 0;
`;
const Options = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-around;
`;
export default ProjectsIndex;
