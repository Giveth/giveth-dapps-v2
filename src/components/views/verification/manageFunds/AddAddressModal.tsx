import styled from 'styled-components';
import React, { ChangeEvent, FC, useState } from 'react';
import { IconWalletOutline } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletOutline';
import { Button } from '@giveth/ui-design-system';
import { ethers } from 'ethers';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import SelectNetwork from '@/components/views/verification/manageFunds/SelectNetwork';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import config from '@/configuration';
import { showToastError } from '@/lib/helpers';
interface IProps extends IModal {
	addAddress: (address: IAddress) => void;
	addresses: IAddress[];
}

const networkOptions = [
	{
		value: config.PRIMARY_NETWORK.id,
		label: 'Ethereum Mainnet',
		name: 'Ethereum',
		isGivbackEligible: false,
	},
	{
		value: config.SECONDARY_NETWORK.id,
		label: 'Gnosis',
		name: 'Gnosis',
		isGivbackEligible: false,
	},
];

const AddAddressModal: FC<IProps> = ({
	setShowModal,
	addAddress,
	addresses,
}) => {
	const [address, setAddress] = useState('');
	const [title, setTitle] = useState('');
	const [selectedNetwork, setSelectedNetwork] = useState<ISelectedNetwork>();
	const [customInput, setCustomInput] = useState('');

	const handleSubmit = async () => {
		const isDuplicate = addresses.some(item => {
			return item.title === title;
		});
		if (address && title && selectedNetwork) {
			//TODO: Check ENS Addresses
			if (!ethers.utils.isAddress(address)) {
				showToastError('The address in not valid');
				return;
			} else if (isDuplicate) {
				showToastError('Please provide a unique title');
				return;
			}
			addAddress({
				address,
				title,
				networkId: selectedNetwork.value,
			});
			setShowModal(false);
		} else {
			showToastError('Please provide all values');
		}
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
					onChange={e => setSelectedNetwork(e)}
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
					<Button
						size='small'
						label='CANCEL'
						buttonType='texty'
						onClick={() => setShowModal(false)}
					/>
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
