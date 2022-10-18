import { useRouter } from 'next/router';
import {
	D3,
	Lead,
	Button,
	H3,
	brandColors,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import Routes from '@/lib/constants/Routes';
import { Arc } from '@/components/styled-components/Arc';
import { isUserRegistered } from '@/lib/helpers';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { mediaQueries } from '@/lib/constants/constants';
import { Col } from '@/components/Grid';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';

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
	const intl = useIntl();
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
		<Wrapper>
			<PurpleArc />
			<CyanArc />
			<MustardArc />
			<Title>
				{intl.formatMessage({
					id: 'page.home.section.calling_all_change_makers',
				})}
			</Title>
			<br />
			<LeadStyled size='large'>
				{intl.formatMessage({
					id: 'page.home.section.calling_all_change_makers.subtitle',
				})}
			</LeadStyled>
			<MiddleSection>
				<Lead>
					{intl.formatMessage({
						id: 'page.home.section.calling_all_change_makers.description',
					})}
				</Lead>
				<br />
				<CreateProjectButton
					buttonType='primary'
					size='large'
					label={intl.formatMessage({
						id: 'component.button.create_project',
					})}
					onClick={handleCreateButton}
				/>
			</MiddleSection>
			<EndSection>
				{content.map(i => (
					<EndItem key={i.title}>
						<H3 weight={700}>{i.title}</H3>
						<br />
						<ContentLead>{i.description}</ContentLead>
					</EndItem>
				))}
			</EndSection>
		</Wrapper>
	);
};

const LeadStyled = styled(Lead)`
	text-align: center;
	${mediaQueries.tablet} {
		text-align: left;
	}
`;

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
	max-width: calc(100vw - 36px);
`;

const EndSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 72px;

	${mediaQueries.tablet} {
		margin-top: 190px;
	}
`;

const ContentLead = styled(Lead)`
	${mediaQueries.tablet} {
		max-width: 330px;
	}
	${mediaQueries.laptopS} {
		max-width: 450px;
	}
`;

const MiddleSection = styled.div`
	max-width: 670px;
	margin: 50px 0;
	${mediaQueries.laptopL} {
		margin: 50px 130px;
	}
`;

const Title = styled(D3)`
	@media only screen and (max-width: ${deviceSize.tablet}px) {
		font-size: 36px;
		text-align: center;
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
