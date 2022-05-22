import { useRouter } from 'next/router';
import { H1, brandColors, Button, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { Arc } from '@/components/styled-components/Arc';
import { isUserRegistered } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.sclie';

const HomeHeader = () => {
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
			<Title weight={700}>Welcome to the Future of Giving</Title>
			<Subtitle>
				Get rewarded for giving to for-good projects with zero added
				fees.
			</Subtitle>
			<AllProjectsButton
				buttonType='primary'
				size='large'
				label='SEE PROJECTS'
				onClick={() => router.push(Routes.Projects)}
			/>
			<CreateProject
				buttonType='texty'
				size='large'
				label='Create a Project'
				onClick={handleCreateButton}
			/>
			<MustardArc />
		</Wrapper>
	);
};

const Title = styled(H1)`
	margin-bottom: 0.5rem;
	padding-top: 3rem;
`;

const Subtitle = styled(Lead)`
	margin: 23px 0;
	padding-bottom: 30px;
`;

const AllProjectsButton = styled(Button)`
	height: 66px;
	padding: 0 80px;
`;

const CreateProject = styled(Button)`
	height: 66px;
	color: ${brandColors.mustard[500]};
	a {
		font-weight: 400;
	}

	&:hover {
		background-color: transparent;
		color: ${brandColors.mustard[500]};
	}
`;

const MustardArc = styled(Arc)`
	border-width: 60px;
	border-color: ${brandColors.mustard[500]};
	top: 150px;
	left: -250px;
	width: 360px;
	height: 360px;
	display: none;

	${mediaQueries.tablet} {
		display: unset;
	}
`;

const Wrapper = styled(FlexCenter)`
	height: 650px;
	text-align: center;
	background: ${brandColors.giv[500]};
	color: white;
	flex-direction: column;
	z-index: 2;
	position: relative;
	background-image: url('/images/GIV_homepage.svg');
`;

export default HomeHeader;
