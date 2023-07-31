import React from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';

interface ICreateProjectAddAddressModal {
	setShowModal: (show: boolean) => void;
	networkId: number;
	isActive?: boolean;
	userAddresses: string[];
}

const CreateProjectAddAddressModal = ({
	setShowModal,
	networkId,
	isActive = true,
	userAddresses,
}: ICreateProjectAddAddressModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerTitle='Add new Address'
		>
			<AddressContainer>
				<WalletAddressInput
					networkId={networkId}
					isActive={isActive}
					userAddresses={userAddresses}
					setResolvedENS={() => {}}
				/>
			</AddressContainer>
		</Modal>
	);
};

const AddressContainer = styled.div`
	max-width: 558px;
	height: 558px;
	padding: 0 8px;
	text-align: left;
`;

export default CreateProjectAddAddressModal;
