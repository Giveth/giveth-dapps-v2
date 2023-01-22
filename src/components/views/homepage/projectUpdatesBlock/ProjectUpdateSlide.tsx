import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
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
			<ProjectUpdateCard>Project Updates</ProjectUpdateCard>
		</ProjectUpdateSlideWrapper>
	);
};

const ProjectUpdateSlideWrapper = styled(Flex)`
	gap: 24px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const StyledProjectCard = styled(ProjectCard)`
	${mediaQueries.laptopS} {
		width: 384px !important;
	}
`;

const ProjectUpdateCard = styled(Flex)`
	flex: 1;
	padding: 32px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;
