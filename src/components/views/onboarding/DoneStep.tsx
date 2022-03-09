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
import { Row } from '@/components/styled-components/Grid';
import CongratsAnimation from '@/animations/congrats.json';
import Routes from '@/lib/constants/Routes';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';

const CongratsAnimationOptions = {
	loop: true,
	animationData: CongratsAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const DoneStep = () => {
	const {
		state: { user },
		actions: { showCompleteProfile },
	} = useUser();

	const router = useRouter();

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			showCompleteProfile();
		}
	};

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
						<ContributeCardButton
							onClick={handleCreateButton}
							label='New project'
						/>
					</ContributeCard>
					<ContributeCard>
						<div>
							<ContributeCardTitle weight={700}>
								Donate to projects
							</ContributeCardTitle>
							<ContributeCardDesc>
								Take a look and donate to projects
							</ContributeCardDesc>
						</div>
						<Link href={Routes.Projects} passHref>
							<ContributeCardButton label='View projects' />
						</Link>
					</ContributeCard>
				</ContributeCardRow>
			</DoneStepContainer>
			<GotoHomeWrapper>
				<P>or go to homepage to start exploring</P>
				<Link href={Routes.Home} passHref>
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
