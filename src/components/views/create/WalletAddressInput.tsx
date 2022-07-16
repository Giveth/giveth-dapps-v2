import React from 'react';
import { H6, IconETH, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';

import { InputContainer, TinyLabel } from './Create.sc';
import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import Input from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { EInputs } from '@/components/views/create/CreateProject';
import { walletAddressValidation } from '@/components/views/create/helpers';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';

const WalletAddressInput = (props: {
	networkId: number;
	defaultValue?: string;
	equalAddress?: boolean;
}) => {
	const {
		register,
		formState: { errors },
		getValues,
		watch,
	} = useFormContext();
	const { networkId, defaultValue, equalAddress } = props;

	watch([EInputs.mainAddress, EInputs.secondaryAddress]);

	const { chainId, library } = useWeb3React();

	const user = useAppSelector(state => state.user?.userData);
	const isGnosis = networkId === config.SECONDARY_NETWORK.id;
	const isDefaultAddress = compareAddresses(
		getValues(isGnosis ? EInputs.secondaryAddress : EInputs.mainAddress),
		user?.walletAddress,
	);

	return (
		<Container>
			<Header>
				<H6>
					{equalAddress
						? 'Receiving address'
						: isGnosis
						? 'Gnosis chain address'
						: 'Mainnet address'}
				</H6>
				<Flex gap='10px'>
					{equalAddress ? (
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
			<InputContainer>
				<Input
					label='Receiving address'
					placeholder='My Wallet Address'
					defaultValue={defaultValue}
					register={register}
					registerName={
						isGnosis
							? EInputs.secondaryAddress
							: EInputs.mainAddress
					}
					registerOptions={{
						...requiredOptions.field,
						validate: i =>
							walletAddressValidation(
								i,
								library,
								chainId,
								networkId,
							),
					}}
					error={
						errors[
							isGnosis
								? EInputs.secondaryAddress
								: EInputs.mainAddress
						]
					}
				/>
				{isGnosis && (
					<TinyLabel>
						Please DO NOT enter exchange addresses for this network.
						<br />
					</TinyLabel>
				)}
				{isDefaultAddress && (
					<TinyLabel>
						This is the default wallet address associated with your
						account. You can choose a different receiving address.
					</TinyLabel>
				)}
			</InputContainer>
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

export default WalletAddressInput;
