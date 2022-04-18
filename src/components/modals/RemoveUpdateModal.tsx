import { IModal, Modal } from '@/components/modals/Modal';
import { FC } from 'react';
import styled from 'styled-components';
import { IconTrash } from '@giveth/ui-design-system/lib/cjs/components/icons/Trash';
import {
	Button,
	Lead,
	brandColors,
	IconAlertTriangle,
} from '@giveth/ui-design-system';
import FixedToast from '@/components/toasts/FixedToast';

export const RemoveUpdateModal: FC<IModal> = ({ setShowModal, callback }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<IconTrash size={24} />}
			headerTitle='Removing Update'
			headerTitlePosition='left'
		>
			<Container>
				<Description>
					Are you sure you want to remove this update?
				</Description>
				<FixedToast
					message={`You can't undo this action`}
					color={brandColors.mustard[700]}
					backgroundColor={brandColors.mustard[200]}
					icon={
						<IconAlertTriangle
							size={16}
							color={brandColors.mustard[700]}
						/>
					}
				/>
				<OkButton
					label='YES, REMOVE IT'
					onClick={callback}
					buttonType={'primary'}
				/>
				<NoButton
					label='CANCEL'
					onClick={() => setShowModal(false)}
					buttonType={'texty'}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	height: 300px;
	width: 528px;
	padding: 19px;
	text-align: left;
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const NoButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 0 auto;
	:hover {
		background: transparent;
	}
`;

const Description = styled(Lead)`
	margin: 24px 0;
`;
