import {
	brandColors,
	H4,
	H6,
	Lead,
	neutralColors,
	OutlineLinkButton,
	P,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IStep, OnboardStep } from './common';
import { Row } from '@/components/styled-components/Grid';
import CongratsAnimation from '@/animations/congrats.json';
import Lottie from 'react-lottie';
import Link from 'next/link';

const CongratsAnimationOptions = {
	loop: true,
	animationData: CongratsAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const DoneStep: FC<IStep> = ({ setStep }) => {
	return (
		<>
			<DoneStepContainer>
				<CongratsContainer>
					<Lottie
						options={CongratsAnimationOptions}
						height={287}
						width={750}
						speed={0.8}
					/>
					<CongratsText>
						<H4 weight={700}>Well done!</H4>
						<P>Now your profile complete.</P>
					</CongratsText>
				</CongratsContainer>
				<ContributeCardRow>
					<ContributeCard>
						<div>
							<ContributeCardTitle weight={700}>
								Create a project
							</ContributeCardTitle>
							<ContributeCardDesc>
								You can create a project and receive funds.
							</ContributeCardDesc>
						</div>
						<Link href='/create' passHref>
							<ContributeCardButton label='New project' />
						</Link>
					</ContributeCard>
					<ContributeCard>
						<div>
							<ContributeCardTitle weight={700}>
								Donate to projets
							</ContributeCardTitle>
							<ContributeCardDesc>
								Take a look and donate to projects
							</ContributeCardDesc>
						</div>
						<Link href='/projects' passHref>
							<ContributeCardButton label='View projects' />
						</Link>
					</ContributeCard>
				</ContributeCardRow>
			</DoneStepContainer>
			<GotoHomeWrapper>
				<P>or go to homepage to start exploring</P>
				<Link href='/' passHref>
					<GotoHomeLink as='a'>Home page</GotoHomeLink>
				</Link>
			</GotoHomeWrapper>
		</>
	);
};

const CongratsContainer = styled.div`
	position: relative;
`;

const CongratsText = styled(Row)`
	flex-direction: column;
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translateX(-50%);
`;

const DoneStepContainer = styled(OnboardStep)`
	background: ${neutralColors.gray[100]};
	border-radius: 16px;
	padding: 0 24px 24px;
	width: 950px;
`;

const ContributeCardRow = styled(Row)`
	gap: 24px;
	gap: 16px;
`;

const ContributeCard = styled(Row)`
	background: ${brandColors.giv[500]};
	color: ${neutralColors.gray[100]};
	text-align: center;
	border-radius: 12px;
	padding: 32px;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	min-height: 212px;
	background-image: url('/images/backgrounds/onboard-card.svg');
	background-size: contain;
`;

const ContributeCardTitle = styled(H6)`
	margin-bottom: 8px;
`;
const ContributeCardDesc = styled(P)``;

const ContributeCardButton = styled(OutlineLinkButton)`
	width: 156px;
`;

const GotoHomeWrapper = styled(Row)`
	margin-top: 17px;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;

const GotoHomeLink = styled(P)`
	color: ${brandColors.pinky[500]};
`;

export default DoneStep;
