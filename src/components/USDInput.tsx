import {
	GLink,
	neutralColors,
	brandColors,
	Flex,
} from '@giveth/ui-design-system';
import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import BigNumber from 'bignumber.js';
import { parseUnits } from 'viem';
import { formatWeiHelper } from '@/helpers/number';
import { PoolStakingConfig } from '@/types/config';

interface IAmountInput {
	maxAmount: bigint;
	poolStakingConfig: PoolStakingConfig;
	disabled?: boolean;
}

export const USDInput: FC<IAmountInput> = ({
	maxAmount,
	poolStakingConfig,
	disabled = false,
}) => {
	const [displayAmount, setDisplayAmount] = useState('');
	const { formatMessage } = useIntl();
	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			const newAmount = new BigNumber(maxAmount.toString())
				.multipliedBy(percentage)
				.div(100)
				.toString();
			setDisplayAmount(formatWeiHelper(newAmount, 6, false));
		},
		[maxAmount],
	);

	const onChange = (value: string) => {
		try {
			parseUnits(value || '0', 6).toString();
		} catch (error) {
			console.log('number is not acceptable');
			captureException(error, {
				tags: {
					section: 'USDInput',
				},
			});
			return;
		}
		setDisplayAmount(value);
	};

	return (
		<>
			<InputLabelRow $justifyContent='space-between'>
				<InputLabel>
					<InputLabelText>
						{' '}
						{formatMessage({ id: 'label.available' })}:{' '}
					</InputLabelText>
					<InputLabelValue>
						&nbsp;
						{formatWeiHelper(maxAmount)}
						&nbsp;
						{poolStakingConfig.title}
						&nbsp;LP
					</InputLabelValue>
				</InputLabel>
				<InputLabelAction
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					Max
				</InputLabelAction>
			</InputLabelRow>
			<Input
				value={displayAmount}
				type='number'
				placeholder='0'
				onChange={e => onChange(e.target.value)}
				disabled={disabled}
			/>
			<FiltersRow>
				<Filter
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					$100
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(1000);
					}}
				>
					$1,000
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(5000);
					}}
				>
					$5,000
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(10000);
					}}
				>
					$10,000
				</Filter>
			</FiltersRow>
		</>
	);
};

const InputLabelRow = styled(Flex)``;
const InputLabel = styled(GLink)`
	display: flex;
`;
const InputLabelText = styled.div`
	color: ${neutralColors.gray[100]};
`;
const InputLabelValue = styled.div``;
const InputLabelAction = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;

export const Input = styled.input`
	width: 100%;
	height: 54px;
	padding: 15px 16px;
	margin-top: 10px;
	margin-bottom: 8px;

	background: ${brandColors.giv[700]};
	color: ${neutralColors.gray[100]};

	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;

	font-family: Red Hat Text;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 150%;

	&:focus {
		outline: none;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	${props => (props.disabled ? `color: ${brandColors.giv[300]};` : '')}
`;

const FiltersRow = styled(Flex)`
	gap: 8px;
`;

const Filter = styled(GLink)`
	padding: 8px 16px;
	color: ${brandColors.deep[100]};
	background: ${brandColors.giv[700]};
	border-radius: 54px;
	cursor: pointer;
`;
