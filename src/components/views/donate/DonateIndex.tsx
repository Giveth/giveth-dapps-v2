import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import {
	H4,
	brandColors,
	P,
	Lead,
	neutralColors,
	H6,
	Subline,
	GLink,
	Button,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import ProjectCard from '@/components/project-card/ProjectCardAlt';
import { Shadow } from '@/components/styled-components/Shadow';
import CryptoDonation from './CryptoDonation';
import FiatDonation from './FiatDonation';
import { IProjectBySlug } from '@/apollo/types/types';
import { BigArc } from '@/components/styled-components/Arc';
import ConfettiAnimation from '../../animations/confetti';
import RadioOnIcon from '/public/images/radio_on.svg';
import RadioOffIcon from '/public/images/radio_off.svg';
import { formatEtherscanLink } from '@/utils';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { mediaQueries } from '@/utils/constants';
import SocialBox from './SocialBox';
import Routes from '@/lib/constants/Routes';

const CRYPTO_DONATION = 'Cryptocurrency';
const FIAT_DONATION = 'Credit Card';

const ProjectsIndex = (props: IProjectBySlug) => {
	const { project } = props;
	const [donationType, setDonationType] = useState(CRYPTO_DONATION);
	const [isSuccess, setSuccess] = useState<any>(null);
	const [hideMobileCard, setHideMobileCard] = useState<boolean>(true);
	const { isMobile } = useDeviceDetect();

	const { chainId: networkId } = useWeb3React();

	const givBackEligible = isSuccess?.givBackEligible;
	const txHash = isSuccess?.transactionHash;

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
						setSuccessDonation={(successTx: any) =>
							setSuccess(successTx)
						}
					/>
				) : (
					<FiatDonation
						project={project}
						setSuccessDonation={(successTx: any) =>
							setSuccess(successTx)
						}
					/>
				)}
			</>
		);
	};

	const SuccessView = () => {
		return (
			<SucceessContainer>
				<ConfettiContainer>
					<ConfettiAnimation size={300} />
				</ConfettiContainer>
				<GiverH4>You're a giver now!</GiverH4>
				{/* <Image src='/images/motivation.svg' alt='motivation' width='121px' height='121px' /> */}
				<SuccessMessage>
					Thank you for supporting The Giveth Community of Makers.
					Your contribution goes a long way!
				</SuccessMessage>
				{givBackEligible && (
					<GivBackContainer>
						<H6>You&#39;re eligible for GIVbacks!</H6>
						<P>
							GIV rewards from the GIVbacks program will be
							distributed after the end of the current round.
						</P>
						<Link passHref href={Routes.GIVbacks}>
							<LearnButton label='LEARN MORE' />
						</Link>
					</GivBackContainer>
				)}
				{!givBackEligible && <SocialBox project={project} isSuccess />}
				<Options>
					<P style={{ color: neutralColors.gray[900] }}>
						Your transaction has been submitted.
					</P>
					<GLink
						style={{
							color: brandColors.pinky[500],
							fontSize: '16px',
							cursor: 'pointer',
							margin: '8px 0 24px 0',
						}}
					>
						<a
							href={formatEtherscanLink('Transaction', [
								networkId,
								txHash,
							])}
							target='_blank'
							rel='noopener noreferrer'
						>
							View on explorer
						</a>
					</GLink>
					<Link passHref href={Routes.Projects}>
						<ProjectsButton label='SEE MORE PROJECTS' />
					</Link>
				</Options>
			</SucceessContainer>
		);
	};

	const ProjectCardSelector = () => {
		if (isMobile) {
			return (
				<CardMobileWrapper
					onClick={() => setHideMobileCard(!hideMobileCard)}
				>
					<SlideBtn />
					{!hideMobileCard && (
						<MobileCardContainer>
							<ProjectCard project={project} noHearts={true} />
							<SocialBox project={project} />
						</MobileCardContainer>
					)}
				</CardMobileWrapper>
			);
		} else {
			return (
				<Left>
					<ProjectCard project={project} noHearts={true} />
				</Left>
			);
		}
	};

	return (
		<Container>
			<BigArc />
			<Wrapper>
				<Sections>
					<ProjectCardSelector />
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
				{!isSuccess && !isMobile && <SocialBox project={project} />}
			</Wrapper>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	background-color: rgba(246, 247, 249);
	align-items: center;
`;

const ConfettiContainer = styled.div`
	position: absolute;
	top: 200px;
`;

const GiverH4 = styled(H4)`
	color: ${brandColors.deep[700]};
`;

const Wrapper = styled.div`
	width: 1052px;
	text-align: center;
	padding: 137px 0;
	align-items: center;
	margin: 0 auto;
`;

const Sections = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(2, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(2, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Left = styled.div`
	z-index: 1;
	justify-content: center;
	align-items: center;
	background: ${neutralColors.gray[200]};
	box-shadow: ${Shadow.Neutral[400]};
	padding: 29px;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
	${mediaQueries.mobileL} {
		align-items: flex-start;
		> div:first-child {
			padding: 0 1%;
		}
	}
`;

const Right = styled.div`
	z-index: 1;
	background: white;
	text-align: left;
	padding: 65px 32px 32px;
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
	min-height: 620px;
	> h4 {
		color: ${brandColors.deep[700]};
		font-weight: bold;
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
	justify-content: space-between;
	margin-top: 29px;
	flex-wrap: wrap;
	${mediaQueries['tablet']} {
		flex-direction: row;
	}

	@media (max-width: 850px) {
		/* Very unique size issue */
		margin-bottom: 10px;
	}
`;

const RadioTitleBox = styled.div`
	display: flex;
	flex-direction: row;
	cursor: pointer;
	margin-bottom: 10px;
`;

const SucceessContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	padding: 0 39px;
	color: ${brandColors.deep[900]};
	height: 100%;
	${mediaQueries['mobileS']} {
		padding: 0;
	}
`;

const SuccessMessage = styled(P)`
	margin: -19px 0 16px 0;
	color: ${brandColors.deep[900]};
	${mediaQueries['mobileS']} {
		margin: 16px 0;
	}
`;

const Options = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const ProjectsButton = styled(Button)`
	width: 242px;
	height: 48px;
	font-size: 12px;
`;

const LearnButton = styled(Button)`
	width: 200px;
	height: 48px;
	font-size: 16px;
	border-color: white;
	margin: 16px 0 0 0;
`;

const GivBackContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 454px;
	height: 212px;
	padding: 0 53px;
	align-items: center;
	background-image: url('/images/GIVeconomy_Banner.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	border-radius: 12px;
	color: white;
	h6 {
		font-weight: bold;
		margin: 0 0 8px 0;
	}
	${mediaQueries['mobileS']} {
		width: 100%;
	}
`;

const CardMobileWrapper = styled.div`
	flex-direction: column;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	left: 0;
	bottom: 0;
	margin: 0;
	-webkit-backface-visibility: hidden;
	padding: 0 16px;
	background-color: white;
	z-index: 10;
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.7);
	border-radius: 40px 40px 0 0;
`;

const MobileCardContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const SlideBtn = styled.div`
	width: 78px;
	height: 0;
	margin: 16px 0;
	border: 1.5px solid ${brandColors.giv[500]};
	border-radius: 15%;
`;

export default ProjectsIndex;
