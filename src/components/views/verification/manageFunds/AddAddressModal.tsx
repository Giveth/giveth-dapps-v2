import styled from 'styled-components';
import React, { FC } from 'react';
import { Button, IconWalletOutline24 } from '@giveth/ui-design-system';
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
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { requiredOptions } from '@/lib/constants/regex';

interface IProps extends IModal {
	addAddress: (address: IAddress) => void;
	addresses: IAddress[];
}

const networkOptions = [
	{
		value: config.MAINNET_NETWORK_NUMBER,
		label: 'Ethereum Mainnet',
		id: config.MAINNET_NETWORK_NUMBER,
	},
	{
		value: config.XDAI_NETWORK_NUMBER,
		label: 'Gnosis',
		id: config.XDAI_NETWORK_NUMBER,
	},
	{
		value: config.POLYGON_NETWORK_NUMBER,
		label: 'Polygon Mainnet',
		id: config.POLYGON_NETWORK_NUMBER,
	},
	{
		value: config.CELO_NETWORK_NUMBER,
		label: 'Celo Mainnet',
		id: config.CELO_NETWORK_NUMBER,
	},
	{
		value: config.OPTIMISM_NETWORK_NUMBER,
		label: 'Optimism',
		id: config.OPTIMISM_NETWORK_NUMBER,
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
		getValues,
	} = useForm<IAddressForm>({ mode: 'onBlur', reValidateMode: 'onBlur' });

	const { library, chainId } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const watchTitle = watch('title');

	const handleAdd = async (formData: IAddressForm) => {
		const { address, title, network } = formData;
		const isEns = isAddressENS(address);
		const _address = isEns
			? await getAddressFromENS(address, library)
			: utils.getAddress(address);
		addAddress({
			address: _address,
			title,
			networkId: network.value,
		});
		closeModal();
	};

	const validateTitle = (title: string) => {
		const isDuplicate = addresses.some(item => item.title === title);
		return isDuplicate ? 'Please provide a unique title' : true;
	};

	const validateAddress = async (address: string) => {
		let actualAddress = address;
		if (!library) return 'Web3 is not initialized';
		if (isAddressENS(address)) {
			if (chainId !== 1) {
				return 'Please switch to Mainnet to handle ENS addresses';
			}
			actualAddress = await getAddressFromENS(address, library);
			if (!actualAddress) return 'Invalid ENS address';
		} else {
			if (!utils.isAddress(address)) return 'Invalid address';
		}
		const isDuplicate = addresses.some(
			item =>
				item.address.toLowerCase() === actualAddress.toLowerCase() &&
				item.networkId === getValues('network')?.value,
		);
		return isDuplicate ? 'Address already exists' : true;
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			headerTitle='Add an Address'
			headerIcon={<IconWalletOutline24 />}
		>
			<Container>
				<form onSubmit={handleSubmit(handleAdd)}>
					<Controller
						control={control}
						name='network'
						rules={requiredOptions.field}
						render={({ field, fieldState: { error } }) => (
							<SelectNetwork
								networkOptions={networkOptions}
								selectedNetwork={field.value}
								onChange={network => field.onChange(network)}
								error={error}
							/>
						)}
					/>
					<br />
					<Input
						register={register}
						registerName='title'
						registerOptions={{
							...requiredOptions.title,
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
							...requiredOptions.walletAddress,
							validate: validateAddress,
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
