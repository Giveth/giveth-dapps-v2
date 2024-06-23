import styled from 'styled-components';
import { type FC } from 'react';
import { IconTrash32, P } from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IDeleteProjectModal extends IModal {
	project: IProject;
}

const DeleteProjectModal: FC<IDeleteProjectModal> = ({
	setShowModal,
	project,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Confirm Project Removal'
			headerIcon={<IconTrash32 />}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<P>
					Are you sure you want to remove {project.title} permanently?
				</P>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

export default DeleteProjectModal;
