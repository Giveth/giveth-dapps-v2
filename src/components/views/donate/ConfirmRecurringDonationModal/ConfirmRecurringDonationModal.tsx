import React, { FC } from 'react';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

interface IConfirmRecurringDonationModalProps extends IModal {}

export const ConfirmRecurringDonationModal: FC<
	IConfirmRecurringDonationModalProps
> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<ConfirmRecurringDonationInnerModal setShowModal={setShowModal} />
		</Modal>
	);
};

const ConfirmRecurringDonationInnerModal: FC<
	IConfirmRecurringDonationModalProps
> = () => {
	return <div></div>;
};
