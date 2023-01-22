import React, { FC, useEffect, useRef, useState } from 'react';
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
	const elRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleObserver = (entities: any) => {
			const target = entities[0];
			if (target.isIntersecting) {
				console.log(project.title);
			}
		};
		const option = {
			root: null,
			threshold: 1,
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (elRef.current) {
			observer.observe(elRef.current);
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, []);

	return (
		<ProjectUpdateSlideWrapper ref={elRef}>
			<StyledProjectCard project={project} />
			<ProjectUpdateCard>Project Updates</ProjectUpdateCard>
		</ProjectUpdateSlideWrapper>
	);
};

const ProjectUpdateSlideWrapper = styled(Flex)`
	padding: 16px 0;
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
