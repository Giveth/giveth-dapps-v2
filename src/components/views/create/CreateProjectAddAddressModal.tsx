import { IconWalletOutline24 } from '@giveth/ui-design-system';
import React from 'react';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';

interface ICreateProjectAddAddressModal {
	setShowModal: (show: boolean) => void;
	networkId: number;
	isActive: boolean;
	setIsActive: (active: boolean) => void;
	userAddresses: string[];
}

const CreateProjectAddAddressModal = ({
	setShowModal,
	networkId,
	isActive,
	setIsActive,
	userAddresses,
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
			<WalletAddressInput
				networkId={networkId}
				isActive={isActive}
				setIsActive={setIsActive}
				userAddresses={userAddresses}
				setResolvedENS={() => {}}
			/>
		</Modal>
	);
};

export default CreateProjectAddAddressModal;
