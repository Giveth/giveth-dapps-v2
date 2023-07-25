import React from 'react';
import {
	IconVerifiedBadge16,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { useProjectContext } from '@/context/project.context';
import ProjectBadge from './ProjectBadge';
import { hasActiveRound } from '@/helpers/qf';

const ProjectBadges = () => {
	const { projectData } = useProjectContext();

	const { verified, qfRounds } = projectData || {};
	const { formatMessage } = useIntl();

	const isQF = hasActiveRound(qfRounds);
	return (
		<CustomFlex gap='16px'>
			{verified && (
				<ProjectBadge
					badgeText={formatMessage({
						id: 'label.verified',
					})}
					wrapperColor={semanticColors.jade[700]}
					BadgeIcon={<IconVerifiedBadge16 />}
				/>
			)}
			{isQF && (
				<ProjectBadge
					badgeText={formatMessage({
						id: 'label.eligible_for_matching',
					})}
					wrapperColor={brandColors.cyan[600]}
				/>
			)}
		</CustomFlex>
	);
};

const CustomFlex = styled(Flex)`
	margin-bottom: 12px;
`;

export default ProjectBadges;
