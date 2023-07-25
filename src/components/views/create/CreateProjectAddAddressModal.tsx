import { IconWalletOutline24 } from '@giveth/ui-design-system';
import React from 'react';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface ICreateProjectAddAddressModal {
	setShowModal: (show: boolean) => void;
}

const CreateProjectAddAddressModal = ({
	setShowModal,
}: ICreateProjectAddAddressModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerTitle='Add an Address'
			headerIcon={<IconWalletOutline24 />}
		>
			CreateProjectAddAddressModal
		</Modal>
	);
};

export default CreateProjectAddAddressModal;
