import React, { FC, useEffect, useState } from 'react';
import { H6, IconETH, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';

import { TinyLabel } from './Create.sc';
import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import Input, { InputSize } from '@/components/Input';
import { EInputs } from '@/components/views/create/CreateProject';
import { gqlAddressValidation } from '@/components/views/create/helpers';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';
import CheckBox from '@/components/Checkbox';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';

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
	} = useFormContext();

	const [isHidden, setIsHidden] = useState(false);
	const [isValidating, setIsValidating] = useState(false);

	const { chainId, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);
	const isGnosis = networkId === config.SECONDARY_NETWORK.id;
	const value = getValues(
		isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress,
	);
	const isDefaultAddress = compareAddresses(value, user?.walletAddress);

	let disabled: boolean;
	if (isGnosis) disabled = !isActive;
	else disabled = !isActive && !sameAddress;

	const isPrevProjectAddress = (i: string) => {
		// Do not validate if the input address is the same as prev project wallet address
		if (userAddresses.length === 0) return false;
		return userAddresses
			.map(i => i.toLowerCase())
			.includes(i.toLowerCase());
	};

	const ENSHandler = async (i: string) => {
		if (networkId !== config.PRIMARY_NETWORK.id) {
			throw 'ENS is only supported on Ethereum Mainnet';
		}
		if (chainId !== 1) {
			throw 'Please switch to the Ethereum Mainnet to handle ENS';
		}
		const address = await getAddressFromENS(i, library);
		if (address) return address;
		else throw 'Invalid ENS address';
	};

	const addressValidation = async (i: string) => {
		try {
			if (disabled) return true;
			setResolvedENS('');
			let address = i;
			setIsValidating(true);
			if (isAddressENS(i)) {
				address = await ENSHandler(i);
				setResolvedENS(address);
			}
			if (isPrevProjectAddress(address)) {
				setIsValidating(false);
				return true;
			}
			if (!utils.isAddress(address)) {
				setIsValidating(false);
				return 'Eth address not valid';
			}
			const res = await gqlAddressValidation(address);
			setIsValidating(false);
			return res;
		} catch (e) {
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
				size={InputSize.LARGE}
				disabled={disabled}
				caption={resolvedENS && 'Resolves as ' + resolvedENS}
				isValidating={isValidating}
				register={register}
				registerName={
					isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress
				}
				registerOptions={{ validate: addressValidation }}
				error={
					errors[
						isGnosis
							? EInputs.secondaryAddress
							: EInputs.mainAddress
					]
				}
			/>
			<TinyLabel>
				{isDefaultAddress
					? 'This is the default wallet address associated with your account. You can choose a different receiving address.'
					: `You can enter a new address to receive funds on ${
							sameAddress
								? 'all supported networks'
								: isGnosis
								? 'Gnosis Chain'
								: 'Mainnet network'
					  }.`}
			</TinyLabel>
			{isGnosis && (
				<TinyLabel>
					<br />
					Please DO NOT enter exchange addresses for this network.
				</TinyLabel>
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
