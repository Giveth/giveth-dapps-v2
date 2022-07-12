import styled from 'styled-components';
import React, { FC } from 'react';
import { IconWalletOutline } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletOutline';
import { Button } from '@giveth/ui-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import SelectNetwork from '@/components/views/verification/manageFunds/SelectNetwork';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import config from '@/configuration';
import { isAddressValid } from '@/lib/wallet';
import { showToastError } from '@/lib/helpers';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IProps extends IModal {
	addAddress: (address: IAddress) => void;
	addresses: IAddress[];
}

const networkOptions = [
	{
		value: config.PRIMARY_NETWORK.id,
		label: 'Ethereum Mainnet',
		name: 'Ethereum',
	},
	{
		value: config.SECONDARY_NETWORK.id,
		label: 'Gnosis',
		name: 'Gnosis',
	},
];

export interface IAddressForm {
	address: string;
	title: string;
	network: ISelectedNetwork;
}

const AddAddressModal: FC<IProps> = ({
	setShowModal,
	addAddress,
	addresses,
}) => {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IAddressForm>();
	const { library } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const handleAdd = async (formData: IAddressForm) => {
		const { address, title } = formData;
		const isDuplicate = addresses.some(item => item.title === title);
		if (address && title && formData.network) {
			if (isDuplicate) {
				showToastError('Please provide a unique title');
				return;
			}
			addAddress({
				address: address,
				title: title,
				networkId: formData.network.value,
			});
			closeModal();
		} else {
			showToastError('Please provide all values');
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerTitle='Add an Address'
			headerIcon={<IconWalletOutline />}
		>
			<Container>
				<form onSubmit={handleSubmit(handleAdd)}>
					<Controller
						control={control}
						name='network'
						render={({ field }) => (
							<SelectNetwork
								networkOptions={networkOptions}
								selectedNetwork={field.value}
								onChange={network => field.onChange(network)}
							/>
						)}
					/>

					<br />
					<Input
						register={register}
						registerName='title'
						registerOptions={{
							required: {
								value: true,
								message: 'Title is required',
							},
						}}
						label='Address Title'
						caption='Choose a title for this address.'
						error={errors.title}
						maxLength={40}
					/>
					<br />
					<Input
						register={register}
						registerName='address'
						label='Wallet Address'
						caption='Enter the related address.'
						registerOptions={{
							validate: async address => {
								return (await isAddressValid(address, library))
									? true
									: 'The address in not valid';
							},
						}}
						error={errors.address}
					/>
					<Buttons>
						<Button
							size='small'
							label='ADD NEW ADDRESS'
							buttonType='secondary'
							type='submit'
						/>
						<Button
							size='small'
							label='CANCEL'
							buttonType='texty'
							onClick={closeModal}
						/>
					</Buttons>
				</form>
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
