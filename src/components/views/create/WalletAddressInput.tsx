import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	Button,
	Caption,
	H6,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';

import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import Input, { InputSize } from '@/components/Input';
import { EInputs } from '@/components/views/create/CreateProject';
import { gqlAddressValidation } from '@/components/views/create/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import useDelay from '@/hooks/useDelay';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';

const networksConfig = config.NETWORKS_CONFIG;

interface IProps {
	networkId: number;
	userAddresses: string[];
	resolvedENS?: string;
	setResolvedENS: (resolvedENS: string) => void;
	onSubmit?: () => void;
}

const WalletAddressInput: FC<IProps> = ({
	networkId,
	userAddresses,
	resolvedENS,
	setResolvedENS,
	onSubmit,
}) => {
	const { getValues, clearErrors, setValue } = useFormContext();

	const { chainId = 1, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);

	const inputName = EInputs.addresses[chainId];
	const value = getValues(inputName);
	const [isValidating, setIsValidating] = useState(false);
	const { formatMessage } = useIntl();
	const [inputValue, setInputValue] = useState(value);
	const [error, setError] = useState({
		message: '',
		ref: undefined,
		type: undefined,
	});

	const isDefaultAddress = compareAddresses(value, user?.walletAddress);
	const errorMessage = error.message;

	const isAddressUsed =
		errorMessage.indexOf(
			formatMessage({ id: 'label.is_already_being_used_for_a_project' }),
		) > -1;

	const delayedResolvedENS = useDelay(!!resolvedENS);
	const delayedIsAddressUsed = useDelay(isAddressUsed);

	let caption: string = '';
	if (isDefaultAddress) {
		caption = formatMessage({
			id: 'label.this_is_the_default_address_associated_with_your_account',
		});
	} else if (errorMessage || !value) {
		caption = `${formatMessage({
			id: 'label.you_can_enter_a_new_address',
		})} ${networksConfig[networkId].chainName}.`;
	}

	const isProjectPrevAddress = (newAddress: string) => {
		// Do not validate if the input address is the same as project prev wallet address
		if (userAddresses.length === 0) return false;
		return userAddresses
			.map(prevAddress => prevAddress.toLowerCase())
			.includes(newAddress.toLowerCase());
	};

	const ENSHandler = async (ens: string) => {
		if (networkId !== config.MAINNET_NETWORK_NUMBER) {
			throw formatMessage({
				id: 'label.ens_is_only_supported_on_mainnet',
			});
		}
		if (chainId !== 1) {
			throw formatMessage({
				id: 'label.please_switcth_to_mainnet_to_handle_ens',
			});
		}
		const address = await getAddressFromENS(ens, library);
		if (address) return address;
		else throw formatMessage({ id: 'label.invalid_ens_address' });
	};

	const addressValidation = async (address: string) => {
		try {
			clearErrors(inputName);
			setResolvedENS('');
			if (address.length === 0) {
				return formatMessage({ id: 'label.this_field_is_required' });
			}
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
				return formatMessage({ id: 'label.eth_addres_not_valid' });
			}
			const res = await gqlAddressValidation(_address);
			setIsValidating(false);
			return res;
		} catch (e: any) {
			setIsValidating(false);
			return e;
		}
	};

	useEffect(() => {
		//We had an issue with onBlur so when the user clicks on submit exactly after filling the address, then process of address validation began, so i changed it to this.
		addressValidation(inputValue).then(res => {
			if (res === true) {
				setError({ ...error, message: '' });
				return;
			}
			setError({ ...error, message: res });
		});
	}, [inputValue]);

	return (
		<Container>
			<Header>
				<H6>
					{formatMessage(
						{ id: 'label.chain_address' },
						{
							chainName: networksParams[networkId].chainName,
						},
					)}
				</H6>
				<Flex gap='10px'>
					<ChainIconShadow>
						<NetworkLogo chainId={networkId} logoSize={24} />
					</ChainIconShadow>
				</Flex>
			</Header>
			<Input
				label={formatMessage(
					{
						id: 'label.receiving_address_on',
					},
					{
						chainName: networksConfig[networkId].chainName,
					},
				)}
				placeholder={formatMessage({ id: 'label.my_wallet_address' })}
				caption={caption}
				size={InputSize.LARGE}
				isValidating={isValidating}
				value={inputValue}
				onChange={e => {
					setInputValue(e.target.value);
				}}
				error={!error.message || !inputValue ? undefined : error}
			/>
			{delayedResolvedENS && (
				<InlineToast
					isHidden={!resolvedENS}
					type={EToastType.Success}
					message={
						formatMessage({ id: 'label.resolved_as' }) + resolvedENS
					}
				/>
			)}
			{delayedIsAddressUsed && (
				<InlineToast
					isHidden={!isAddressUsed}
					type={EToastType.Error}
					message={formatMessage({
						id: 'label.this_address_is_already_used',
					})}
				/>
			)}
			<ExchangeNotify>
				<Warning>!</Warning>
				<Caption>
					{formatMessage({
						id: 'label.please_do_not_enter_exchange_deposit',
					})}
				</Caption>
			</ExchangeNotify>
			<ButtonWrapper>
				<Button
					label='Add ADDRESS'
					disabled={
						error.message !== '' ||
						inputValue === '' ||
						isValidating === true
					}
					onClick={() => {
						setValue(inputName, inputValue);
						onSubmit && onSubmit();
					}}
				/>
			</ButtonWrapper>
		</Container>
	);
};

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

const Container = styled.div`
	margin-top: 25px;
	background: ${neutralColors.gray[100]};
	border-radius: 12px;
	padding: 16px;
`;

const ButtonWrapper = styled.div`
	position: absolute;
	right: 20px; // Adjust the distance from the right edge as per your need
	bottom: 78px; // Adjust the distance from the bottom edge as per your need
	${mediaQueries.tablet} {
		bottom: 20px;
	}
`;
export default WalletAddressInput;
