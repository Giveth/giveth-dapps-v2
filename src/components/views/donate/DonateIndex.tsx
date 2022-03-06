import React, { useState } from 'react';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import ProjectCard from '@/components/project-card/ProjectCardAlt';
import { Shadow } from '@/components/styled-components/Shadow';
import CryptoDonation from './CryptoDonation';
import FiatDonation from './FiatDonation';
import { IProjectBySlug } from '@/apollo/types/types';
import { BigArc } from '@/components/styled-components/Arc';
import ConfettiAnimation from '../../animations/confetti';
import RadioOnIcon from '/public/images/radio_on.svg';
import RadioOffIcon from '/public/images/radio_off.svg';
import { formatEtherscanLink } from '../../../utils';
import SocialBox from './SocialBox';
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
import Link from 'next/link';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';

const CRYPTO_DONATION = 'Cryptocurrency';
const FIAT_DONATION = 'Credit Card';

const ProjectsIndex = (props: IProjectBySlug) => {
	const { project } = props;
	const [donationType, setDonationType] = useState(CRYPTO_DONATION);
	const [isSuccess, setSuccess] = useState<any>(null);

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

	return (
		<Container>
			<BigArc />
			<Wrapper>
				<Sections>
					<Left>
						<ProjectCard
							key={project.id}
							project={project}
							noHearts={true}
						/>
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
				{!isSuccess && <SocialBox project={project} />}
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
	display: grid;
	grid-template-columns: repeat(2, minmax(500px, 1fr));
	grid-auto-rows: minmax(100px, auto);
`;
const Left = styled.div`
	display: grid;
	justify-content: center;
	align-items: center;
	grid-auto-flow: column;
	z-index: 1;
	grid-column: 1 / 2;
	grid-row: 1;
	background: ${neutralColors.gray[200]};
	box-shadow: ${Shadow.Neutral[400]};
	padding: 29px 0;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
`;
const Right = styled.div`
	z-index: 1;
	grid-row: 1;
	background: white;
	text-align: left;
	padding: 65px 32px 32px;
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
	min-height: 620px;
	h4 {
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
	padding: 0 39px;
	color: ${brandColors.deep[900]};
	height: 100%;
`;
const SuccessMessage = styled(P)`
	margin: -19px 0 16px 0;
	color: ${brandColors.deep[900]};
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
	background-image: url(/images/GIVeconomy_Banner.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	border-radius: 12px;
	color: white;
	h6 {
		font-weight: bold;
		margin: 0 0 8px 0;
	}
`;

export default ProjectsIndex;
