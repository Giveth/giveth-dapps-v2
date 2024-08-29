import styled from 'styled-components';
import React, { FC } from 'react';
import { Button, IconWalletOutline24 } from '@giveth/ui-design-system';
import { Controller, useForm } from 'react-hook-form';
import { getAddress, isAddress } from 'viem';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import SelectNetwork from '@/components/views/verification/manageFunds/SelectNetwork';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import config from '@/configuration';
import { getAddressFromENS, isAddressENS, isSolanaAddress } from '@/lib/wallet';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { requiredOptions } from '@/lib/constants/regex';
import { getChainName } from '@/lib/network';
import useFocus from '@/hooks/useFocus';
import { ChainType, NonEVMNetworkConfig } from '@/types/config';

interface IProps extends IModal {
	addAddress: (address: IAddress) => void;
	addresses: IAddress[];
}

const networksConfig = config.NETWORKS_CONFIG;
const networkOptions = Object.keys(networksConfig).map(key => {
	const chain = networksConfig[key];
	const networkId = chain.id;
	const chainType = (chain as NonEVMNetworkConfig).chainType;
	return {
		value: networkId,
		label: getChainName(networkId, chainType),
		id: networkId,
		chainType,
	};
});

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

	const { chain } = useAccount();
	const chainId = chain?.id;
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [inputRef] = useFocus();

	const watchTitle = watch('title');
	const watchChain = watch('network');

	const handleAdd = async (formData: IAddressForm) => {
		const { address, title, network } = formData;
		let _address: null | string = address;
		if (!network.chainType) {
			const isEns = isAddressENS(address);
			_address = isEns
				? await getAddressFromENS(address)
				: getAddress(address);
		}
		if (_address) {
			addAddress({
				address: _address,
				title,
				networkId: network.value,
				chainType: network.chainType,
			});
		}
		closeModal();
	};

	const validateTitle = (title: string) => {
		const isDuplicate = addresses.some(item => item.title === title);
		return isDuplicate ? 'Please provide a unique title' : true;
	};

	const validateAddress = async (address: string) => {
		let actualAddress = address;
		if (watchChain?.chainType === ChainType.SOLANA) {
			if (!isSolanaAddress(address)) {
				return 'Invalid Solana address';
			}
		} else if (isAddressENS(address)) {
			if (chainId !== 1) {
				return 'Please switch to Mainnet to handle ENS addresses';
			}
			const temp = await getAddressFromENS(address);
			if (!temp) return 'Invalid ENS address';
			actualAddress = temp;
		} else if (!isAddress(address)) {
			return 'Invalid ETH address';
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
								ref={inputRef}
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
							label={formatMessage({
								id: 'label.add_new_address',
							})}
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
	& > :last-child {
		margin-top: 10px;
		&:hover {
			background-color: transparent;
		}
	}
	& > * {
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
