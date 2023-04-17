import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	Caption,
	H6,
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
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import CheckBox from '@/components/Checkbox';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import useDelay from '@/hooks/useDelay';
import { IconEthereum } from '@/components/Icons/Eth';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';

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
	} = useFormContext();

	const [isHidden, setIsHidden] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const { formatMessage } = useIntl();

	const { chainId, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);
	const isMainnet = networkId === config.MAINNET_NETWORK_NUMBER;
	const isGnosis = networkId === config.XDAI_NETWORK_NUMBER;
	const isPolygon = networkId === config.POLYGON_NETWORK_NUMBER;
	const isCelo = networkId === config.CELO_NETWORK_NUMBER;
	const isOptimism = networkId === config.OPTIMISM_NETWORK_NUMBER;
	const inputName = isGnosis
		? EInputs.gnosisAddress
		: isPolygon
		? EInputs.polygonAddress
		: isCelo
		? EInputs.celoAddress
		: isOptimism
		? EInputs.optimismAddress
		: EInputs.mainAddress;
	const value = getValues(inputName);
	const isDefaultAddress = compareAddresses(value, user?.walletAddress);
	const error = errors[inputName];
	const errorMessage = (error?.message || '') as string;
	const isAddressUsed =
		errorMessage.indexOf(
			formatMessage({ id: 'label.is_already_being_used_for_a_project' }),
		) > -1;

	const delayedResolvedENS = useDelay(!!resolvedENS);
	const delayedIsAddressUsed = useDelay(isAddressUsed);

	let disabled: boolean;
	if (isGnosis) disabled = !isActive;
	else disabled = !isActive && !sameAddress;

	let caption: string = '';
	if (isDefaultAddress) {
		caption = formatMessage({
			id: 'label.this_is_the_default_address_associated_with_your_account',
		});
	} else if (errorMessage || !value) {
		caption = `${formatMessage({
			id: 'label.you_can_enter_a_new_address',
		})} ${
			sameAddress
				? formatMessage({ id: 'label.all_supported_networks' })
				: isGnosis
				? 'Gnosis Chain'
				: isPolygon
				? 'Polygon Mainnet'
				: isCelo
				? 'Celo Mainnet'
				: isOptimism
				? 'Optimism'
				: 'Mainnet'
		}.`;
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
			if (disabled) return true;
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
		if (sameAddress) {
			setTimeout(() => setIsHidden(true), 250);
		} else {
			setIsHidden(false);
		}
	}, [sameAddress]);

	if (isHidden && !isMainnet) return null;

	return (
		<Container hide={sameAddress && !isMainnet}>
			<Header>
				<H6>
					{sameAddress
						? formatMessage({ id: 'label.receiving_address' })
						: formatMessage(
								{ id: 'label.chain_address' },
								{
									chainName:
										networksParams[networkId].chainName,
								},
						  )}
				</H6>
				<Flex gap='10px'>
					{sameAddress ? (
						<>
							<MainnetIcon />
							<GnosisIcon />
							<PolygonIcon />
							<CeloIcon />
							<OptimismIcon />
						</>
					) : isGnosis ? (
						<GnosisIcon />
					) : isPolygon ? (
						<PolygonIcon />
					) : isCelo ? (
						<CeloIcon />
					) : isOptimism ? (
						<OptimismIcon />
					) : (
						<MainnetIcon />
					)}
				</Flex>
			</Header>
			<Input
				label={
					sameAddress
						? formatMessage({ id: 'label.receiving_address' })
						: formatMessage(
								{
									id: 'label.receiving_address_on',
								},
								{
									chainName: isGnosis
										? 'Gnosis Chain'
										: isPolygon
										? 'Polygon Mainnet'
										: isCelo
										? 'Celo Mainnet'
										: isOptimism
										? 'Optimism Mainnet'
										: 'Mainnet',
								},
						  )
				}
				placeholder={formatMessage({ id: 'label.my_wallet_address' })}
				caption={caption}
				size={InputSize.LARGE}
				disabled={disabled}
				isValidating={isValidating}
				register={register}
				registerName={inputName}
				registerOptions={{ validate: addressValidation }}
				error={isAddressUsed ? undefined : error}
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
			{!isHidden && (
				<CheckBoxContainer
					className={sameAddress ? 'fadeOut' : 'fadeIn'}
				>
					<CheckBox
						onChange={setIsActive}
						label={formatMessage({
							id: 'label.ill_receive_funds_on_this_address',
						})}
						checked={isActive}
					/>
				</CheckBoxContainer>
			)}
		</Container>
	);
};

const OptimismIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.OPTIMISM_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const CeloIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.CELO_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const PolygonIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.POLYGON_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const GnosisIcon = () => (
	<ChainIconShadow>
		<IconGnosisChain size={24} />
	</ChainIconShadow>
);

const MainnetIcon = () => (
	<ChainIconShadow>
		<IconEthereum size={24} />
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
