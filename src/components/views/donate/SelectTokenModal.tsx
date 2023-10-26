import { FC } from 'react';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface ISelectTokenModalProps extends IModal {}

export const SelectTokenModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal setShowModal={setShowModal} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	return <div>Hi</div>;
};
