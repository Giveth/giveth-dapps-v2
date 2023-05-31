import { Caption, neutralColors } from '@giveth/ui-design-system';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { BigNumber, utils } from 'ethers';
import { captureException } from '@sentry/nextjs';
import { NumericalInput } from '@/components/input';

export const DepositCard = () => {
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
			<StyledNumericalInput
				value={displayAmount}
				onUserInput={onUserInput}
				disabled={false}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
`;

const StyledNumericalInput = styled(NumericalInput)`
	background-color: ${neutralColors.gray[100]};
	color: ${neutralColors.gray[800]};
	border: none;
	border-radius: 0;
	border-left: 2px solid ${neutralColors.gray[400]};
	::placeholder {
		color: ${neutralColors.gray[800]};
	}
`;
