import styled from 'styled-components';
import React, { ChangeEvent, FC, useState } from 'react';
import { IconWalletOutline } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletOutline';
import { Button } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import SelectNetwork from '@/components/views/verification/manageFunds/SelectNetwork';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import { RelatedAddress } from '@/apollo/types/types';

interface IProps extends IModal {
	addAddress: (address: RelatedAddress) => void;
}

const networkOptions = [
	{
		value: {
			name: 'Ethereum',
		},
		label: 'Ethereum Mainnet',
		name: 'Ethereum',
		isGivbackEligible: false,
	},
	{
		value: {
			name: 'Gnosis',
		},
		label: 'Gnosis',
		name: 'Gnosis',
		isGivbackEligible: false,
	},
];

const AddAddressModal: FC<IProps> = ({ setShowModal, addAddress }) => {
	const [address, setAddress] = useState('');
	const [title, setTitle] = useState('');
	const [selectedNetwork, setSelectedNetwork] = useState<ISelectedNetwork>();
	const [customInput, setCustomInput] = useState('');

	const handleSubmit = () => {
		addAddress({
			address,
			title,
			networkId: 1,
		});
		setShowModal(false);
	};

	return (
		<Modal
			setShowModal={setShowModal}
			headerTitlePosition='left'
			headerTitle='Add an Address'
			headerIcon={<IconWalletOutline />}
		>
			<Container>
				<SelectNetwork
					tokenList={networkOptions}
					selectedNetwork={selectedNetwork}
					inputValue={customInput}
					onChange={setSelectedNetwork}
					placeholder='Search network name'
					onInputChange={setCustomInput}
				/>
				<br />
				<Input
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTitle(e.target.value)
					}
					value={title}
					name='AddressTitle'
					label='Address Title'
					caption='Choose a title for this address.'
				/>
				<br />
				<Input
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setAddress(e.target.value)
					}
					value={address}
					name='Address'
					label='Receiving address'
					caption='Enter the related address.'
				/>
				<Buttons>
					<Button
						size='small'
						label='ADD NEW ADDRESS'
						buttonType='secondary'
						onClick={handleSubmit}
					/>
					<Button size='small' label='CANCEL' buttonType='texty' />
				</Buttons>
			</Container>
		</Modal>
	);
};

const Buttons = styled.div`
	margin-top: 80px;
	> :last-child {
		margin-top: 10px;
		:hover {
			background-color: transparent;
		}
	}
	> * {
		width: 100%;
	}
`;

const Container = styled.div`
	width: 100vw;
	padding: 26px;
	text-align: left;
	${mediaQueries.mobileL} {
		width: 425px;
	}
	${mediaQueries.tablet} {
		width: 480px;
	}
`;

export default AddAddressModal;
