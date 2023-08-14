import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';
import { EInputs } from '@/components/views/create/CreateProject';
import config from '@/configuration';

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

	const { getValues } = useFormContext();
	const addresses = getValues(EInputs.addresses);
	const value = addresses[networkId];

	return (
		<Modal
			closeModal={() => {
				// remove resolvedENS when user has set ENS but closes modal. ENS is only available for mainnet
				!value &&
					networkId === config.MAINNET_NETWORK_NUMBER &&
					setResolvedENS('');
				closeModal();
			}}
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
