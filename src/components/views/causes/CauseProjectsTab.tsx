import styled from 'styled-components';
import { ICauseProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/constants/constants';

export const CauseProjectsTab = ({
	causeProjects,
}: {
	causeProjects: ICauseProject[];
}) => {
	// list proejct cards
	return (
		<Wrapper>
			<ProjectsWrapper>
				<ProjectsContainer>
					{causeProjects.map(causeProject => (
						<ProjectCard
							key={causeProject.id}
							project={causeProject.project}
						/>
					))}
				</ProjectsContainer>
			</ProjectsWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	${mediaQueries.tablet} {
		padding-top: 33px;
		padding-bottom: 33px;
	}
	${mediaQueries.laptopS} {
		padding-top: 40px;
		padding-bottom: 40px;
	}
`;

export const ProjectsWrapper = styled.div`
	margin-bottom: 64px;
`;

export const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	padding: 0 23px;

	${mediaQueries.tablet} {
		padding: 0;
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;
