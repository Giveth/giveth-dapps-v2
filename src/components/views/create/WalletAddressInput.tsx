import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import {
	InputContainer,
	InputErrorMessage,
	InputWithError,
	TinyLabel,
} from './Create.sc';
import { compareAddresses } from '@/lib/helpers';
import { ECreateErrFields } from '@/components/views/create/CreateProject';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';

const WalletAddressInput = (props: {
	title: string;
	networkId: number;
	value?: string;
	setValue: (e: string) => void;
	error: string;
}) => {
	const { value, setValue, title, networkId, error } = props;
	const user = useAppSelector(state => state.user?.userData);
	const isDefaultAddress = compareAddresses(value, user?.walletAddress);
	return (
		<>
			<H5
				id={
					networkId
						? ECreateErrFields.MAIN_WALLET_ADDRESS
						: ECreateErrFields.SECONDARY_WALLET_ADDRESS
				}
			>
				{title}
			</H5>
			{networkId === config.PRIMARY_NETWORK.id && (
				<div>
					<CaptionContainer>
						You can set a custom Ethereum address or ENS to receive
						donations.{' '}
					</CaptionContainer>
				</div>
			)}

			<InputContainer>
				<InputWithError
					placeholder='My Wallet Address'
					onChange={e => setValue(e.target.value)}
					value={value}
					error={!!error}
					// disabled={isDefaultAddress && !error} // why are we doing this?
				/>
				<InputErrorMessage>{error || null}</InputErrorMessage>
				{isDefaultAddress && (
					<TinyLabel>
						This is the default wallet address associated with your
						account. You can choose a different receiving address.
					</TinyLabel>
				)}
				{isDefaultAddress && !error && (
					<ChangeAddress onClick={() => setValue('')}>
						Change address
					</ChangeAddress>
				)}
			</InputContainer>
		</>
	);
};

const ChangeAddress = styled(Caption)`
	color: ${brandColors.pinky[500]};
	margin-top: 16px;
	cursor: pointer;
`;

const CaptionContainer = styled(Caption)`
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

export default WalletAddressInput;
