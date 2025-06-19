import { FC, Fragment } from 'react';
import styled from 'styled-components';
import { useCauseContext } from '@/context/cause.context';
import { mediaQueries } from '@/lib/constants/constants';
import ProjectCard from '@/components/project-card/ProjectCard';

const CauseProjects: FC = () => {
	const { causeData } = useCauseContext();

	console.log('🧪 causeData', causeData);

	return (
		<ProjectsWrapper>
			<ProjectsContainer>
				{causeData?.projects?.map((project, idx) => (
					<Fragment key={idx}>
						<div key={project.id} id={project.slug}>
							<ProjectCard project={project} order={idx} />
						</div>
					</Fragment>
				))}
			</ProjectsContainer>
		</ProjectsWrapper>
	);
};

export default CauseProjects;

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
