import React from 'react';
import {
	IconAlertTriangleFilled32,
	IconCheckCircleFilled32,
} from '@giveth/ui-design-system';
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
			headerIcon={
				isSuccess === true ? (
					<IconCheckCircleFilled32 />
				) : (
					<IconAlertTriangleFilled32 />
				)
			}
		>
			{isSuccess === true ? 'True' : 'False'}
		</Modal>
	);
};

export default EligibilityModal;
