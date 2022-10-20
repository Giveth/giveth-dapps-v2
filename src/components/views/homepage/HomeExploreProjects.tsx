import { useRouter } from 'next/router';
import {
	Button,
	H5,
	brandColors,
	neutralColors,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import ProjectCard from '@/components/project-card/ProjectCard';
import { IProject } from '@/apollo/types/types';
import { useIntl } from 'react-intl';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered } from '@/lib/helpers';
import { FlexCenter } from '@/components/styled-components/Flex';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';

interface IHomeExploreProjects {
	projects: IProject[];
	totalCount?: number;
	noTitle?: boolean;
}

const HomeExploreProjects = (props: IHomeExploreProjects) => {
	const { projects, totalCount, noTitle } = props;

	const { formatMessage } = useIntl();
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
			{!noTitle && (
				<>
					<Title>
						{formatMessage({
							id: 'page.projects.title.explore',
						})}{' '}
						<span>
							{totalCount}{' '}
							{formatMessage({
								id: 'page.projects.title.projects',
							})}
						</span>
					</Title>
					<Subtitle>
						{formatMessage({
							id: 'page.projects.subtitle.donate_crypto',
						})}
					</Subtitle>
				</>
			)}
			<ProjectsContainer>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</ProjectsContainer>
			<ButtonsWrapper>
				<AllProjectsButton
					buttonType='primary'
					size='large'
					label={formatMessage({
						id: 'component.button.see_all_projects',
					})}
					onClick={() => router.push(Routes.Projects)}
				/>
				<CreateProject
					buttonType='texty'
					size='large'
					label={formatMessage({
						id: 'component.button.create_project',
					})}
					onClick={handleCreateButton}
				/>
			</ButtonsWrapper>
		</Wrapper>
	);
};

const AllProjectsButton = styled(Button)`
	width: 300px;
`;

const CreateProject = styled(Button)`
	height: 66px;
	color: ${brandColors.pinky[500]};
	a {
		font-weight: 400;
	}

	&:hover {
		background-color: transparent;
		color: ${brandColors.pinky[500]};
	}
`;

const ButtonsWrapper = styled(FlexCenter)`
	flex-direction: column;
	margin: 64px auto;
`;

const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	margin-bottom: 64px;
	margin-top: 28px;

	${mediaQueries.tablet} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Title = styled(H5)`
	font-weight: 700;

	span {
		color: ${neutralColors.gray[700]};
	}
`;

const Subtitle = styled(H6)`
	font-weight: 400;
	color: ${neutralColors.gray[700]};
	margin-top: 4px;
`;

const Wrapper = styled.div`
	max-width: ${deviceSize.desktop + 'px'};
	margin: 0 auto;
	padding: 60px 33px;
	color: ${neutralColors.gray[900]};
	position: relative;
`;

export default HomeExploreProjects;
