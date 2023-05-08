import { Button, IconEdit16 } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

export const AdminActions = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
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
			<EditButton
				buttonType='texty-secondary'
				label={formatMessage({ id: 'label.edit' })}
				icon={<IconEdit16 />}
			/>
		</div>
	);
};

const EditButton = styled(Button)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	box-shadow: 0px 3px 20px rgba(83, 38, 236, 0.13);
	padding: 16px 24px;
`;
