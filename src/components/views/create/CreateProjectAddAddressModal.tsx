import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import WalletAddressInput from './WalletAddressInput';
import { IChainType } from '@/types/config';

interface ICreateProjectAddAddressModal extends IChainType {
	setShowModal: () => void;
	networkId: number;
	userAddresses: string[];
	setResolvedENS?: (resolvedENS: string) => void;
	resolvedENS?: string;
}

const CreateProjectAddAddressModal = (props: ICreateProjectAddAddressModal) => {
	const { setShowModal, networkId, userAddresses, chainType } = props;
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerTitle={formatMessage({ id: 'label.add_new_address' })}
		>
			<AddressContainer>
				<WalletAddressInput
					networkId={networkId}
					userAddresses={userAddresses}
					onSubmit={setShowModal}
					chainType={chainType}
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
