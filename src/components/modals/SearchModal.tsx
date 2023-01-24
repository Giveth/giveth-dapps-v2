import React from 'react';
import { useDelayedState } from '@/hooks/useDelayedState';
import { Modal } from './Modal';

export const SearchModal = () => {
	const [modalAnimation, modalCondition, openModal, closeModal] =
		useDelayedState();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={modalAnimation}
			headerTitle='APR'
		>
			<div>Salam</div>
		</Modal>
	);
};
