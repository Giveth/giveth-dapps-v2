import {
	ButtonLink,
	IconEdit16,
	IconVerifiedBadge16,
	OutlineButton,
	brandColors,
} from '@giveth/ui-design-system';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { useProjectContext } from '@/context/project.context';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { idToProjectEdit } from '@/lib/routeCreators';

export const AdminActions = () => {
	const [showVerificationModal, setShowVerificationModal] = useState(false);

	const { projectData, isActive, isDraft } = useProjectContext();
	const { formatMessage } = useIntl();
	return (
		<>
			<Flex flexDirection='column' gap='16px'>
				{/* <FullButton
				buttonType='primary'
				label={formatMessage({ id: 'label.edit' })}
				disabled={!isActive && !isDraft}
				onClick={() =>
					router.push(idToProjectEdit(projectData?.id || ''))
				}
			/>
			{!isRevoked && !verified && !isDraft && !verStatus && (
				<FullOutlineButton
					buttonType='primary'
					label={formatMessage({
						id: 'label.verify_your_project',
					})}
					disabled={!isActive}
					onClick={() => setShowVerificationModal(true)}
				/>
			)} */}
				{/* <ArchiveButton
							buttonType='texty'
							size='small'
							label={`${
								isActive
									? formatMessage({
											id: 'label.deactivate_project',
									  })
									: formatMessage({
											id: 'component.button.activate_project',
									  })
							}`}
							icon={<IconArchiving size={16} />}
							onClick={() => handleProjectStatus(isActive)}
						/> */}
				<EditButton
					isExternal
					linkType='texty-secondary'
					label={formatMessage({ id: 'label.edit' })}
					icon={<IconEdit16 />}
					href={idToProjectEdit(projectData?.id || '')}
				/>
				<VerifyButton
					label={formatMessage({
						id: 'label.verify_your_project',
					})}
					icon={<IconVerifiedBadge16 />}
					disabled={!isActive}
					onClick={() => setShowVerificationModal(true)}
				/>
			</Flex>
			{showVerificationModal && (
				<VerificationModal
					onClose={() => setShowVerificationModal(false)}
				/>
			)}
		</>
	);
};

const EditButton = styled(ButtonLink)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	box-shadow: 0px 3px 20px rgba(83, 38, 236, 0.13);
	padding: 16px 24px;
	&:hover {
		color: ${brandColors.giv[700]};
	}
	transition: color 0.3s ease;
`;

const VerifyButton = styled(OutlineButton)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	padding: 16px 24px;
	color: ${brandColors.giv[500]};
	border: 2px solid ${brandColors.giv[500]};
	&:hover {
		color: ${brandColors.giv[700]};
	}
`;
