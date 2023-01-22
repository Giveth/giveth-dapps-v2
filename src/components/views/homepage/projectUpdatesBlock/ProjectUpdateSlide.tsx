import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';

interface IProjectUpdateSlideProps {
	project: IProject;
}

export const ProjectUpdateSlide: FC<IProjectUpdateSlideProps> = ({
	project,
}) => {
	const [isVisibe, setIsVisibe] = useState(false);
	return (
		<ProjectUpdateSlideWrapper>
			<ProjectCard project={project} />
		</ProjectUpdateSlideWrapper>
	);
};

const ProjectUpdateSlideWrapper = styled(Flex)``;
