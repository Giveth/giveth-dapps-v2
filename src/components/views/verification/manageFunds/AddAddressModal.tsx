import styled from 'styled-components';
import React, { FC } from 'react';
import { IconWalletOutline } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletOutline';
import { Button } from '@giveth/ui-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import SelectNetwork from '@/components/views/verification/manageFunds/SelectNetwork';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import config from '@/configuration';
import { getAddressFromENS, isAddressENS, validateAddress } from '@/lib/wallet';
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
		watch,
	} = useForm<IAddressForm>();
	const { library, chainId } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const watchTitle = watch('title');

	const handleAdd = async (formData: IAddressForm) => {
		const { address, title } = formData;
		const isDuplicate = addresses.some(item => item.title === title);
		if (address && title && formData.network) {
			if (isDuplicate) {
				return showToastError('Please provide a unique title');
			}
			const isEns = isAddressENS(address);
			if (chainId !== 1 && isEns) {
				return showToastError(
					'Please switch to Mainnet to handle ENS addresses',
				);
			}
			const _address = isEns
				? await getAddressFromENS(address, library)
				: utils.getAddress(address);
			addAddress({
				address: _address,
				title,
				networkId: formData.network.value,
			});
			closeModal();
		} else {
			showToastError('Please provide all values');
		}
	};

	const validateTitle = (title: string) => {
		const isDuplicate = addresses.some(item => item.title === title);
		return isDuplicate ? 'Please provide a unique title' : true;
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
							validate: validateTitle,
						}}
						label='Address Title'
						value={watchTitle}
						caption='Choose a title for this address. eg. Salary Payments, Marketing, etc.'
						error={errors.title}
						maxLength={40}
						placeholder='Salary Payments'
					/>
					<br />
					<Input
						register={register}
						registerName='address'
						label='Wallet Address'
						caption='Enter the related address.'
						registerOptions={{
							validate: async i =>
								await validateAddress(i, library, chainId),
							required: {
								value: true,
								message: 'Wallet Address is required',
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
