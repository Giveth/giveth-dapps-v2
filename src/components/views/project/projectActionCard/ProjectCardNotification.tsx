import { useIntl } from 'react-intl';
import styled from 'styled-components';

import {
	semanticColors,
	IconAlertCircle16,
	Flex,
} from '@giveth/ui-design-system';
import { useProjectContext } from '@/context/project.context';

export const ProjectCardNotification = () => {
	const { formatMessage } = useIntl();
	const { isAdmin, projectData } = useProjectContext();

	const isVerified = projectData?.verified;
	const isGivbackEligible = projectData?.isGivbackEligible;

	const isOwnerVerifiedNotEligible =
		isVerified && isAdmin && !isGivbackEligible;

	if (!isOwnerVerifiedNotEligible) {
		return null;
	}

	return (
		<ProjectCardNotificationWrapper>
			<IconAlertCircle16 color={semanticColors.golden[600]} />
			<span>
				{formatMessage({
					id: `project.givback_toast.complete_eligibility`,
				})}
			</span>
		</ProjectCardNotificationWrapper>
	);
};

const ProjectCardNotificationWrapper = styled(Flex)`
	align-items: center;
	padding-top: 12px;
	font-size: 14px;
	color: ${semanticColors.golden[600]};
	span {
		margin-left: 8px;
	}
`;
