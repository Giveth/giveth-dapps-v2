import React, { FC, useEffect, useRef, useState } from 'react';
import {
	Caption,
	H6,
	IconETH,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import debounce from 'lodash.debounce';

import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import Input, { InputSize } from '@/components/Input';
import { EInputs } from '@/components/views/create/CreateProject';
import { gqlAddressValidation } from '@/components/views/create/helpers';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import CheckBox from '@/components/Checkbox';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

interface IProps {
	networkId: number;
	userAddresses: string[];
	sameAddress: boolean;
	isActive: boolean;
	setIsActive: (active: boolean) => void;
	resolvedENS?: string;
	setResolvedENS: (resolvedENS: string) => void;
}

const WalletAddressInput: FC<IProps> = ({
	networkId,
	userAddresses,
	sameAddress,
	isActive,
	setIsActive,
	resolvedENS,
	setResolvedENS,
}) => {
	const {
		register,
		formState: { errors },
		getValues,
		clearErrors,
		setError,
	} = useFormContext();

	const [isHidden, setIsHidden] = useState(false);
	const [isValidating, setIsValidating] = useState(false);

	const { chainId, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);
	const isGnosis = networkId === config.SECONDARY_NETWORK.id;
	const inputName = isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress;
	const value = getValues(inputName);
	const isDefaultAddress = compareAddresses(value, user?.walletAddress);
	const error = errors[inputName];
	const errorMessage = (error?.message || '') as string;
	const isAddressUsed =
		errorMessage.indexOf('is already being used for a project') > -1;

	let disabled: boolean;
	if (isGnosis) disabled = !isActive;
	else disabled = !isActive && !sameAddress;

	const isProjectPrevAddress = (newAddress: string) => {
		// Do not validate if the input address is the same as project prev wallet address
		if (userAddresses.length === 0) return false;
		return userAddresses
			.map(prevAddress => prevAddress.toLowerCase())
			.includes(newAddress.toLowerCase());
	};

	const ENSHandler = async (ens: string) => {
		if (networkId !== config.PRIMARY_NETWORK.id) {
			throw 'ENS is only supported on Ethereum Mainnet';
		}
		if (chainId !== 1) {
			throw 'Please switch to the Ethereum Mainnet to handle ENS';
		}
		const address = await getAddressFromENS(ens, library);
		if (address) return address;
		else throw 'Invalid ENS address';
	};

	const setFormError = (message: string | boolean) => {
		if (typeof message === 'string') {
			setError(inputName, { type: 'validate', message });
		}
	};

	const addressValidation = async (address: string) => {
		try {
			clearErrors(inputName);
			if (disabled) return true;
			setResolvedENS('');
			let _address = (' ' + address).slice(1);
			setIsValidating(true);
			if (isAddressENS(address)) {
				_address = await ENSHandler(address);
				setResolvedENS(_address);
			}
			if (isProjectPrevAddress(_address)) {
				setIsValidating(false);
				return true;
			}
			if (!utils.isAddress(_address)) {
				setIsValidating(false);
				setFormError('Eth address not valid');
				return 'Eth address not valid';
			}
			const res = await gqlAddressValidation(_address);
			setFormError(res);
			setIsValidating(false);
			return res;
		} catch (e: any) {
			setIsValidating(false);
			setFormError(e);
			return e;
		}
	};

	const debouncedValidation = useRef(debounce(addressValidation, 750));

	useEffect(() => {
		if (sameAddress) {
			setTimeout(() => setIsHidden(true), 250);
		} else {
			setIsHidden(false);
		}
	}, [sameAddress]);

	if (isHidden && isGnosis) return null;

	return (
		<Container hide={sameAddress && isGnosis}>
			<Header>
				<H6>
					{isGnosis
						? 'Gnosis Chain address'
						: sameAddress
						? 'Receiving address'
						: 'Mainnet address'}
				</H6>
				<Flex gap='10px'>
					{sameAddress ? (
						<>
							<MainnetIcon />
							<GnosisIcon />
						</>
					) : isGnosis ? (
						<GnosisIcon />
					) : (
						<MainnetIcon />
					)}
				</Flex>
			</Header>
			<Input
				label={
					isGnosis
						? 'Receiving address on Gnosis Chain'
						: sameAddress
						? 'Receiving address'
						: 'Receiving address on Mainnet'
				}
				placeholder='My Wallet Address'
				caption={
					isDefaultAddress
						? 'This is the default wallet address associated with your account. You can choose a different receiving address.'
						: `You can enter a new address to receive funds on ${
								sameAddress
									? 'all supported networks'
									: isGnosis
									? 'Gnosis Chain'
									: 'Mainnet network'
						  }.`
				}
				size={InputSize.LARGE}
				disabled={disabled}
				isValidating={isValidating}
				register={register}
				registerName={inputName}
				registerOptions={{ validate: debouncedValidation.current }}
				error={isAddressUsed ? undefined : error}
			/>
			{resolvedENS && (
				<InlineToast
					type={EToastType.Success}
					message={'Resolves as ' + resolvedENS}
				/>
			)}
			{isAddressUsed && (
				<InlineToast
					type={EToastType.Error}
					message='This address is already used for another project. Please enter an address which is not currently associated with any other project.'
				/>
			)}
			{(isGnosis || sameAddress) && (
				<ExchangeNotify>
					<Warning>!</Warning>
					<Caption>
						Please DO NOT enter exchange addresses for Gnosis Chain.
					</Caption>
				</ExchangeNotify>
			)}
			{!isHidden && (
				<CheckBoxContainer
					className={sameAddress ? 'fadeOut' : 'fadeIn'}
				>
					<CheckBox
						onChange={setIsActive}
						title='I’ll receive fund on this address'
						checked={isActive}
					/>
				</CheckBoxContainer>
			)}
		</Container>
	);
};

const GnosisIcon = () => (
	<ChainIconShadow>
		<IconGnosisChain size={24} />
	</ChainIconShadow>
);

const MainnetIcon = () => (
	<ChainIconShadow>
		<IconETH size={24} />
	</ChainIconShadow>
);

const Warning = styled(FlexCenter)`
	flex-shrink: 0;
	border-radius: 50%;
	border: 1px solid ${semanticColors.blueSky[700]};
	width: 14px;
	height: 14px;
	font-size: 8px;
	font-weight: 700;
`;

const ExchangeNotify = styled(Flex)`
	color: ${semanticColors.blueSky[700]};
	gap: 17px;
	align-items: center;
	margin-top: 24px;
`;

const CheckBoxContainer = styled.div`
	margin-top: 24px;
	padding-top: 11px;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

const ChainIconShadow = styled.div`
	height: 24px;
	width: fit-content;
	border-radius: 50%;
	box-shadow: ${Shadow.Giv[400]};
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	padding-bottom: 10px;
	margin-bottom: 24px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const Container = styled.div<{ hide?: boolean }>`
	margin-top: 25px;
	background: ${neutralColors.gray[100]};
	border-radius: 12px;
	padding: 16px;
	opacity: ${props => (props.hide ? 0 : 1)};
	visibility: ${props => (props.hide ? 'hidden' : 'visible')};
	transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
	animation: fadeIn 0.3s ease-in-out;
`;

export default WalletAddressInput;
