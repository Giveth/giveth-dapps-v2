import React from 'react';
import {
	IconVerifiedBadge16,
	brandColors,
	neutralColors,
	semanticColors,
	Flex,
	IconGIVBack16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useProjectContext } from '@/context/project.context';
import ProjectBadge from './ProjectBadge';
import { hasActiveRound } from '@/helpers/qf';

const ProjectBadges = () => {
	const { projectData } = useProjectContext();

	const { verified, isGivbackEligible, qfRounds, campaigns } =
		projectData || {};
	const { formatMessage } = useIntl();
	const isQF = hasActiveRound(qfRounds);

	if (!verified && !isQF && (!campaigns || campaigns.length === 0)) {
		return null;
	}

	return (
		<CustomFlex gap='16px'>
			{verified && (
				<ProjectBadge
					badgeText={formatMessage({
						id: 'label.vouched',
					})}
					wrapperColor={semanticColors.jade[700]}
					BadgeIcon={<IconVerifiedBadge16 />}
				/>
			)}
			{isGivbackEligible && (
				<ProjectBadge
					badgeText={formatMessage({
						id: 'label.isGivbackEligible',
					})}
					textColor={brandColors.giv[500]}
					wrapperColor={'white'}
					BadgeIcon={<IconGIVBack16 color={brandColors.giv[500]} />}
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
			{campaigns &&
				campaigns?.length > 0 &&
				campaigns.map(campaign => (
					<ProjectBadge
						key={campaign.id}
						badgeText={campaign.title}
						wrapperColor={neutralColors.gray[900]}
					/>
				))}
		</CustomFlex>
	);
};

const CustomFlex = styled(Flex)`
	overflow-x: scroll;
	overflow-y: hidden;
	white-space: nowrap;
	margin-bottom: -3px;
	padding-top: 8px;
`;

export default ProjectBadges;
