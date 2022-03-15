import { useRouter } from 'next/router';
import { D3, Lead, Button, H3, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import Routes from '@/lib/constants/Routes';
import { Arc } from '@/components/styled-components/Arc';
import { isUserRegistered } from '@/lib/helpers';
import useUser from '@/context/UserProvider';

const content = [
	{
		title: 'Easy Onboarding',
		description:
			'New to crypto? No Problem. Create a Torus wallet and connect to the DApp by logging in via your favourite web2 platform.',
	},
	{
		title: 'Zero-Added Fees',
		description:
			'Create a project or donate directly to for-good projects with zero fees added by Giveth.',
	},
	{
		title: 'Project Verification',
		description:
			'Encourage project accountability by donating to trusted projects. Apply for verification and your donors will be rewarded with GIVbacks.',
	},
	{
		title: 'The GIVeconomy',
		description:
			'Give, earn and govern using GIV and the GIVeconomy. Get rewarded for being a GIVer.',
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
			<D3>Calling all Changemakers!</D3>
			<br />
			<Lead>
				Do you have a for-good project that&apos;s creating value for
				society, for the environment, or for the world?
			</Lead>
			<MiddleSection>
				<Lead>
					Establish your project on Giveth to tap into the
					revolutionary funding opportunities of the Ethereum
					Ecosystem. Start raising funds within minutes. Creating a
					project is absolutely free!
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
					<EndItem key={i.title}>
						<H3 weight={700}>{i.title}</H3>
						<br />
						<Lead>{i.description}</Lead>
					</EndItem>
				))}
			</EndSection>
		</Wrapper>
	);
};

const CreateProjectButton = styled(Button)`
	height: 66px;
	padding: 0 80px;
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
	top: 20px;
	right: -200px;
	transform: rotate(-45deg);
`;

const CyanArc = styled(Arc)`
	border-width: 50px;
	border-color: ${`transparent ${brandColors.cyan[500]} ${brandColors.cyan[500]} transparent`};
	transform: rotate(45deg);
	top: 300px;
	left: -150px;
	width: 380px;
	height: 380px;
`;

const EndItem = styled.div`
	max-width: 440px;
`;

const EndSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 70px 145px;
	margin-top: 190px;
`;

const MiddleSection = styled.div`
	padding: 50px 130px;
`;

const Wrapper = styled.div`
	background: ${brandColors.giv[600]};
	color: white;
	padding: 130px 150px 200px 150px;
	position: relative;
	z-index: 2;
	overflow: hidden;
`;

export default HomeChangeMakers;
