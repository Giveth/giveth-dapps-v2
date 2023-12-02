import React, { FC } from 'react';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

interface IRecurringDonationModalProps extends IModal {}

export const RecurringDonationModal: FC<IRecurringDonationModalProps> = ({
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
			<RecurringDonationInnerModal setShowModal={setShowModal} />
		</Modal>
	);
};

const RecurringDonationInnerModal: FC<IRecurringDonationModalProps> = () => {
	return <div></div>;
};
