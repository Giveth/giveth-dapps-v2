import React from 'react';
import { IconVerifiedBadge16, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { useProjectContext } from '@/context/project.context';
import ProjectBadge from './ProjectBadge';

const ProjectBadges = () => {
	const { projectData } = useProjectContext();

	const { verified } = projectData || {};

	return (
		<CustomFlex gap='16px'>
			{verified && (
				<ProjectBadge
					badgeText='Verified'
					wrapperColor={semanticColors.jade[700]}
					BadgeIcon={<IconVerifiedBadge16 />}
				/>
			)}
		</CustomFlex>
	);
};

const CustomFlex = styled(Flex)`
	margin-bottom: 12px;
`;

export default ProjectBadges;
