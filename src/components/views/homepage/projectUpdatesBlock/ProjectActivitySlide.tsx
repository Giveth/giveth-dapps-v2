import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';

interface IProjectActivitySlideProps {
	project: IProject;
}

export const ProjectActivitySlide: FC<IProjectActivitySlideProps> = ({
	project,
}) => {
	const [isVisibe, setIsVisibe] = useState(false);
	return (
		<ProjectActivitySlideWrapper>
			<ProjectCard project={project} />
		</ProjectActivitySlideWrapper>
	);
};

const ProjectActivitySlideWrapper = styled(Flex)``;
