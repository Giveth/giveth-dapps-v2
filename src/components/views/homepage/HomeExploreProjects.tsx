import { useRouter } from 'next/router';
import ProjectCard from '@/components/project-card/ProjectCard';
import { IProject } from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Grid';
import { Button, H5, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IHomeExploreProjects {
	projects: IProject[];
	totalCount?: number;
	noTitle?: boolean;
}

const HomeExploreProjects = (props: IHomeExploreProjects) => {
	const { projects, totalCount, noTitle } = props;
	const router = useRouter();

	return (
		<Wrapper>
			{!noTitle && (
				<Title>
					Explore <span>{totalCount} Projects</span>
				</Title>
			)}
			<ProjectsContainer>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</ProjectsContainer>
			<ButtonsWrapper>
				<Button
					label='SEE ALL PROJECTS'
					onClick={() => router.push(Routes.Projects)}
				></Button>
				<Button
					label='Create a Project'
					onClick={() => router.push(Routes.CreateProject)}
				></Button>
			</ButtonsWrapper>
		</Wrapper>
	);
};

const ButtonsWrapper = styled(FlexCenter)`
	flex-direction: column;
	margin: 64px auto;
`;

const ProjectsContainer = styled.div`
	display: flex;
	gap: 23px 26px;
	flex-wrap: wrap;
`;

const Title = styled(H5)`
	margin-bottom: 25px;
	span {
		color: ${neutralColors.gray[700]};
	}
`;

const Wrapper = styled.div`
	margin: 60px 33px;
	color: ${neutralColors.gray[900]};
	position: relative;
`;

export default HomeExploreProjects;
