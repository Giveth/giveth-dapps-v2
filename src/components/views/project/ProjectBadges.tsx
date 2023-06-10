import React from 'react';
import { IconVerifiedBadge16, semanticColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { useProjectContext } from '@/context/project.context';
import ProjectBadge from './ProjectBadge';

const ProjectBadges = () => {
	const { projectData } = useProjectContext();

	const { verified } = projectData || {};

	return (
		<Flex gap='16px'>
			{verified && (
				<ProjectBadge
					badgeText='Verified'
					wrapperColor={semanticColors.jade[700]}
					BadgeIcon={<IconVerifiedBadge16 />}
				/>
			)}
		</Flex>
	);
};

export default ProjectBadges;
