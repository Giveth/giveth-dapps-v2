import { IconNetwork32, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject } from '@/apollo/types/types';
import type { IModal } from '@/types/common';
import type { FC } from 'react';

interface IAddPolygonAddress extends IModal {
	project: IProject;
}

export const AddPolygonAddress: FC<IAddPolygonAddress> = ({
	project,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			headerIcon={<IconNetwork32 />}
			headerTitle='Add polygon address'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<P>Adding polygon address for {project.title}</P>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 32px 24px 24px;
	${mediaQueries.tablet} {
		width: 462px;
	}
`;
