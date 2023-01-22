import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/constants/constants';

interface IProjectUpdateSlideProps {
	project: IProject;
}

export const ProjectUpdateSlide: FC<IProjectUpdateSlideProps> = ({
	project,
}) => {
	const [isVisibe, setIsVisibe] = useState(false);
	return (
		<ProjectUpdateSlideWrapper>
			<StyledProjectCard project={project} />
			<ProjectUpdateCard></ProjectUpdateCard>
		</ProjectUpdateSlideWrapper>
	);
};

const ProjectUpdateSlideWrapper = styled(Flex)``;

const StyledProjectCard = styled(ProjectCard)`
	${mediaQueries.laptopS} {
		width: 384px !important;
	}
`;

const ProjectUpdateCard = styled(Flex)``;
