import { useRouter } from 'next/router';
import { H2, Lead, Button, H3, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import Routes from '@/lib/constants/Routes';
import { Arc } from '@/components/styled-components/Arc';
import { isUserRegistered } from '@/lib/helpers';
import useUser from '@/context/UserProvider';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { deviceSize, mediaQueries } from '@/utils/constants';
import { Col, Row } from '@/components/Grid';

const content = [
	{
		title: 'Easy Onboarding',
		description:
			'New to crypto? No Problem. Create a Torus wallet and connect to the DApp by logging in via your favourite web2 platform.',
	},
	{
		title: 'Zero-Added Fees',
		description:
			'Create a Project or donate directly to for-good projects with zero fees added by Giveth.',
	},
	{
		title: 'Project Verification',
		description:
			'Encourage project accountability by donating to trusted projects. Apply for verification to reward your donors with GIVbacks.',
	},
	{
		title: 'The Giving Economy',
		description:
			'Give, Earn and Govern using GIV and the GIVeconomy. Become a stakeholder in the future of philanthropy.',
	},
];

const HomeChangeMakers = () => {
	const router = useRouter();
	const {
		state: { user },
		actions: { showCompleteProfile },
	} = useUser();

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			showCompleteProfile();
		}
	};

	return (
		<Wrapper>
			<PurpleArc />
			<CyanArc />
			<MustardArc />
			<Container>
				<UpperSection>
					<H2 weight={700}>Calling all Changemakers!</H2>
					<br />
					<Lead>
						Do you have for-good project that&apos;s creating value
						for society, for the environment or for the world?
					</Lead>
				</UpperSection>
				<MiddleSection>
					<Lead>
						Add you project to Giveth to tap into the revolutionary
						funding opportunities of the Ethereum Ecosystem. Start
						raising funds within minutes. Creating a project is
						absolutely free!
					</Lead>
					<br />
					<CreateProjectButton
						buttonType='primary'
						size='large'
						label='CREATE A PROJECT'
						onClick={handleCreateButton}
					/>
				</MiddleSection>
				<EndSection>
					{content.map(i => (
						<EndItem md={6} key={i.title}>
							<H3 weight={700}>{i.title}</H3>
							<br />
							<Lead>{i.description}</Lead>
						</EndItem>
					))}
				</EndSection>
			</Container>
		</Wrapper>
	);
};

const CreateProjectButton = styled(Button)`
	width: 300px;
`;

const PurpleArc = styled(Arc)`
	border-color: ${`transparent ${brandColors.giv[500]} ${brandColors.giv[500]} ${brandColors.giv[500]}`};
	width: 2000px;
	height: 2000px;
	border-width: 150px;
	top: -1000px;
	right: 180px;
`;

const MustardArc = styled(Arc)`
	border-color: ${brandColors.mustard[500]} transparent transparent
		transparent;
	width: 400px;
	height: 400px;
	border-width: 50px;
	transform: rotate(-45deg);
	top: -100px;
	right: -350px;

	${mediaQueries.tablet} {
		right: -200px;
		top: 200px;
	}
	${mediaQueries.laptopL} {
		top: 20px;
	}
`;

const CyanArc = styled(Arc)`
	border-width: 50px;
	border-color: ${`transparent ${brandColors.cyan[500]} ${brandColors.cyan[500]} transparent`};
	transform: rotate(45deg);
	width: 380px;
	height: 380px;
	top: 20px;
	left: -350px;

	${mediaQueries.tablet} {
		display: none;
	}
	${mediaQueries.laptopL} {
		display: unset;
		top: 150px;
		left: -150px;
	}
`;

const EndItem = styled(Col)`
	padding-bottom: 55px;
	padding-right: 55px;
`;

const EndSection = styled(Row)`
	margin-top: 190px;
`;

const UpperSection = styled.div`
	${mediaQueries.laptopL} {
		margin-left: -120px;
	}
	${mediaQueries.desktop} {
		margin-left: unset;
	}
`;

const MiddleSection = styled.div`
	max-width: 670px;
	margin: 50px 0;
	${mediaQueries.laptopL} {
		margin: 50px 130px;
	}
`;

const Container = styled.div`
	margin: 0 auto;
	${mediaQueries.desktop} {
		max-width: ${deviceSize.desktop + 'px'};
	}
`;

const Wrapper = styled(HomeContainer)`
	background: ${brandColors.giv[600]};
	color: white;
	padding-top: 68px;
	padding-bottom: 150px;
	position: relative;
	z-index: 2;
	overflow: hidden;

	${mediaQueries.laptopL} {
		padding-top: 130px;
	}
`;

export default HomeChangeMakers;
