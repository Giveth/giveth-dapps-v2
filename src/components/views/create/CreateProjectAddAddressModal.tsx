import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';
import { EInputs } from './CreateProject';

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

	const { clearErrors, setValue } = useFormContext();
	const { chainId = 1 } = useWeb3React();

	const inputName = EInputs.addresses[chainId];
	const closeModalAndClearErrorsAndResetValue = useCallback(() => {
		clearErrors(inputName);
		setValue(inputName, '');
		closeModal();
	}, []);

	return (
		<Modal
			closeModal={closeModalAndClearErrorsAndResetValue}
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
	padding: 0 8px;
	text-align: left;
	padding-bottom: 70px;
`;

export default CreateProjectAddAddressModal;
