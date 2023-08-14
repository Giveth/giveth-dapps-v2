import React from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';

interface ICreateProjectAddAddressModal {
	setShowModal: (show: number | undefined) => void;
	networkId: number;
	userAddresses: string[];
	setResolvedENS?: (resolvedENS: string) => void;
	resolvedENS?: string;
	onSubmit?: () => void;
}

const CreateProjectAddAddressModal = ({
	setShowModal,
	networkId,
	userAddresses,
	setResolvedENS = () => {},
	resolvedENS,
	onSubmit,
}: ICreateProjectAddAddressModal) => {
	const { isAnimating, closeModal } = useModalAnimation(() =>
		setShowModal(undefined),
	);

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
					userAddresses={userAddresses}
					setResolvedENS={setResolvedENS}
					resolvedENS={resolvedENS ?? undefined}
					onSubmit={onSubmit}
				/>
			</AddressContainer>
		</Modal>
	);
};

const AddressContainer = styled.div`
	max-width: 558px;
	min-height: 400px;
	padding: 0 8px 70px;
	text-align: left;
`;

export default CreateProjectAddAddressModal;
