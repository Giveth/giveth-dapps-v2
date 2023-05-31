import { B, Caption, neutralColors } from '@giveth/ui-design-system';
import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { BigNumber, utils } from 'ethers';
import { captureException } from '@sentry/nextjs';
import { NumericalInput } from '@/components/input';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { GIVSavingsAccount } from '@/types/config';

interface IDepositCard {
	givsavingsAccount: GIVSavingsAccount;
}

export const DepositCard: FC<IDepositCard> = ({ givsavingsAccount }) => {
	const [displayAmount, setDisplayAmount] = useState('');
	const [amount, setAmount] = useState('0');

	const onUserInput = useCallback((value: string) => {
		setDisplayAmount(value);
		let valueBn = BigNumber.from(0);

		try {
			valueBn = utils.parseUnits(value);
		} catch (error) {
			console.debug(`Failed to parse input amount: "${value}"`, error);
			captureException(error, {
				tags: {
					section: 'AmountInput',
				},
			});
		}

		setAmount(valueBn.toString());
	}, []);

	return (
		<Wrapper>
			<Caption>From Wallet</Caption>
			<InputWrapper>
				<TokenInfo alignItems='center'>
					{/* TODO: Change to Token Icon */}
					<NetworkLogo chainId={5} logoSize={24} />
					<B>{givsavingsAccount.token.name}</B>
				</TokenInfo>
				<StyledNumericalInput
					value={displayAmount}
					onUserInput={onUserInput}
					disabled={false}
				/>
			</InputWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[400]};
	border-radius: 8px;
`;

const TokenInfo = styled(Flex)`
	min-width: 140px;
	padding: 15px;
`;

const StyledNumericalInput = styled(NumericalInput)`
	background-color: ${neutralColors.gray[100]};
	color: ${neutralColors.gray[800]};
	border: none;
	border-radius: 0;
	border-left: 2px solid ${neutralColors.gray[400]};
	padding: 15px;
	margin: 0;
	::placeholder {
		color: ${neutralColors.gray[800]};
	}
`;
