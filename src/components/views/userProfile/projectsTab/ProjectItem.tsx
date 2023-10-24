import { neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';

interface IProjectItem {
	project: IProject;
}

const ProjectItem = ({ project }: IProjectItem) => {
	console.log('project', project);
	return <ProjectContainer>{project?.title}</ProjectContainer>;
};

const ProjectContainer = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
`;

export default ProjectItem;
