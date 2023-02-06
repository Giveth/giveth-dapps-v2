import React from 'react';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IEligibilityModal extends IModal {
	isSuccess: boolean;
}

const EligibilityModal = ({ isSuccess, setShowModal }: IEligibilityModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={'hello'}
			headerTitlePosition='left'
		>
			123
		</Modal>
	);
};

export default EligibilityModal;
