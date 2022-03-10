import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import {
	InputContainer,
	InputErrorMessage,
	InputWithError,
	TinyLabel,
} from './Create.sc';
import useUser from '@/context/UserProvider';
import { compareAddresses } from '@/lib/helpers';
import { ECreateErrFields } from '@/components/views/create/CreateProject';

const WalletAddressInput = (props: {
	value: string;
	setValue: (e: string) => void;
	error: string;
}) => {
	const { value, setValue, error } = props;

	const {
		state: { user },
	} = useUser();

	const isDefaultAddress = compareAddresses(value, user?.walletAddress);

	return (
		<>
			<H5 id={ECreateErrFields.WALLET_ADDRESS}>Receiving funds</H5>
			<div>
				<CaptionContainer>
					You can set a custom Ethereum address or ENS to receive
					donations.{' '}
				</CaptionContainer>
			</div>

			<InputContainer>
				<TinyLabel>Receiving address</TinyLabel>
				<InputWithError
					placeholder='My Wallet Address'
					onChange={e => setValue(e.target.value)}
					value={value}
					error={!!error}
					disabled={isDefaultAddress && !error}
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
