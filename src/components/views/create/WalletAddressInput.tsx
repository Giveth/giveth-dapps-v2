import React, { useEffect, useState } from 'react';
import { H6, IconETH, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';

import { TinyLabel } from './Create.sc';
import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { EInputs } from '@/components/views/create/CreateProject';
import { addressValidation } from '@/components/views/create/helpers';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';
import CheckBox from '@/components/Checkbox';

const WalletAddressInput = (props: {
	networkId: number;
	defaultValue?: string;
	sameAddress: boolean;
	isActive: boolean;
	setIsActive: (active: boolean) => void;
}) => {
	const {
		register,
		formState: { errors },
		getValues,
	} = useFormContext();

	const [isHidden, setIsHidden] = useState(false);

	const { networkId, defaultValue, sameAddress, isActive, setIsActive } =
		props;

	const { chainId, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);
	const isGnosis = networkId === config.SECONDARY_NETWORK.id;
	const isDefaultAddress = compareAddresses(
		getValues(isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress),
		user?.walletAddress,
	);

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
						? 'Gnosis chain address'
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
						? 'Receiving address on Gnosis'
						: sameAddress
						? 'Receiving address'
						: 'Receiving address on Mainnet'
				}
				placeholder='My Wallet Address'
				size={InputSize.LARGE}
				disabled={!isActive && !sameAddress}
				register={register}
				registerName={
					isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress
				}
				registerOptions={{
					...requiredOptions.field,
					validate: i => {
						if (compareAddresses(i, defaultValue)) return true;
						if (!isActive && !sameAddress) return true;
						return addressValidation(
							i,
							library,
							chainId,
							networkId,
						);
					},
				}}
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
					: 'You can enter a new address to receive funds on Mainnet network.'}
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
						label='I’ll receive fund on this address'
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
