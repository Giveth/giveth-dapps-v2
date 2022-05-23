import Lottie from 'react-lottie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	brandColors,
	H4,
	H6,
	neutralColors,
	OutlineLinkButton,
	P,
} from '@giveth/ui-design-system';

import { OnboardStep } from './common';
import { Flex } from '@/components/styled-components/Flex';
import CongratsAnimation from '@/animations/congrats.json';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered } from '@/lib/helpers';
import { Col, Row } from '@/components/Grid';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.sclie';

const CongratsAnimationOptions = {
	loop: true,
	animationData: CongratsAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const DoneStep = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector(state => state.user.userData);

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	return (
		<>
			<DoneStepContainer xs={12} xl={10}>
				<AnimationContainer>
					<Lottie
						options={CongratsAnimationOptions}
						// height={287}
						// width={750}
						speed={0.8}
					/>
				</AnimationContainer>
				<CongratsContainer>
					<CongratsText>
						<H4 weight={700}>Well done!</H4>
						<P>Now your profile is complete.</P>
					</CongratsText>
					<ContributeCardRow>
						<Col xs={12} sm={8} md={6}>
							<ContributeCard>
								<div>
									<ContributeCardTitle weight={700}>
										Create a project
									</ContributeCardTitle>
									<ContributeCardDesc>
										You can create a project and receive
										funds.
									</ContributeCardDesc>
								</div>
								<ContributeCardButton
									onClick={handleCreateButton}
									label='New project'
								/>
							</ContributeCard>
						</Col>
						<Col xs={12} sm={8} md={6}>
							<ContributeCard>
								<div>
									<ContributeCardTitle weight={700}>
										Donate to projects
									</ContributeCardTitle>
									<ContributeCardDesc>
										Take a look and donate to projects.
									</ContributeCardDesc>
								</div>
								<Link href={Routes.Projects} passHref>
									<ContributeCardButton label='View projects' />
								</Link>
							</ContributeCard>
						</Col>
					</ContributeCardRow>
				</CongratsContainer>
			</DoneStepContainer>
			<GotoHomeWrapper>
				<P>or go to the homepage to start exploring.</P>
				<Link href={Routes.Home} passHref>
					<GotoHomeLink as='a'>Home page</GotoHomeLink>
				</Link>
			</GotoHomeWrapper>
		</>
	);
};

const AnimationContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
`;

const CongratsContainer = styled.div`
	position: relative;
	padding: 48px 24px 24px;
	z-index: 2;
`;

const CongratsText = styled.div`
	text-align: center;
	margin-bottom: 48px;
`;

const DoneStepContainer = styled(OnboardStep)`
	background: ${neutralColors.gray[100]};
	border-radius: 16px;
	position: relative;
	overflow: hidden;
`;

const ContributeCardRow = styled(Row)`
	justify-content: center;
`;

const ContributeCard = styled(Flex)`
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
	background-size: cover;
`;

const ContributeCardTitle = styled(H6)`
	margin-bottom: 8px;
`;
const ContributeCardDesc = styled(P)``;

const ContributeCardButton = styled(OutlineLinkButton)`
	width: 156px;
`;

const GotoHomeWrapper = styled(Flex)`
	margin-top: 17px;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;

const GotoHomeLink = styled(P)`
	color: ${brandColors.pinky[500]};
`;

export default DoneStep;
