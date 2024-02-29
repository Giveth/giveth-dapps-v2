import {
	GLink,
	neutralColors,
	brandColors,
	Flex,
} from '@giveth/ui-design-system';
import { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import BigNumber from 'bignumber.js';
import { formatWeiHelper } from '@/helpers/number';
import { BaseInput } from '../input/BaseInput';

export interface IAmountInput {
	setAmount: Dispatch<SetStateAction<bigint>>;
	decimals?: number;
	className?: string;
	disabled?: boolean;
	maxAmount?: bigint;
	showMax?: boolean;
	balanceUnit?: string;
	showPercentage?: boolean;
}

export const AmountInput: FC<IAmountInput> = ({
	maxAmount,
	setAmount,
	className,
	decimals = 18,
	disabled = false,
	showMax = false,
	showPercentage = false,
}) => {
	const { formatMessage } = useIntl();
	const [displayAmount, setDisplayAmount] = useState('');
	const [activeStep, setActiveStep] = useState(0);

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			if (!maxAmount) return;
			const newAmount = new BigNumber(maxAmount.toString())
				.multipliedBy(percentage)
				.div(100)
				.toFixed(0);
			const _displayAmount = formatWeiHelper(newAmount, 6, false);
			setDisplayAmount(_displayAmount);
			setAmount(
				percentage === 100
					? maxAmount
					: BigInt(
							new BigNumber(_displayAmount)
								.multipliedBy(10 ** decimals)
								.toFixed(0),
						),
			);
		},
		[decimals, maxAmount, setAmount],
	);

	const onUserInput = useCallback(
		(value: string) => {
			const [, _decimals] = value.split('.');
			if (_decimals?.length > 6) {
				return;
			}
			setDisplayAmount(value);
			setActiveStep(0);
			let valueBn = new BigNumber(0);

			try {
				valueBn = new BigNumber(value).multipliedBy(10 ** decimals);
				setAmount(BigInt(valueBn.toFixed(0)));
			} catch (error) {
				setAmount(0n);
				console.debug(
					`Failed to parse input amount: "${value}"`,
					error,
				);
				captureException(error, {
					tags: {
						section: 'AmountInput',
					},
				});
			}
		},
		[decimals, setAmount],
	);

	return (
		<div className={className}>
			{showMax && maxAmount !== undefined && (
				<InputLabelRow $justifyContent='space-between' id='max-row'>
					<InputLabel>
						<InputLabelText>
							{formatMessage({ id: 'label.available' })}:{' '}
						</InputLabelText>
						<InputLabelValue>
							&nbsp;
							{formatWeiHelper(maxAmount.toString())}
							&nbsp;
						</InputLabelValue>
					</InputLabel>
					<InputLabelAction
						onClick={() => {
							if (disabled) return;
							setAmountPercentage(100);
							setActiveStep(100);
						}}
					>
						Max
					</InputLabelAction>
				</InputLabelRow>
			)}
			<BaseInput
				value={displayAmount}
				onUserInput={onUserInput}
				disabled={disabled}
				id='amount-input'
			/>
			{showPercentage && (
				<PercentageRow id='percentage-row'>
					<Step
						onClick={() => {
							if (disabled) return;
							setAmountPercentage(25);
							setActiveStep(25);
						}}
						$active={activeStep === 25}
					>
						25%
					</Step>
					<Step
						onClick={() => {
							if (disabled) return;
							setAmountPercentage(50);
							setActiveStep(50);
						}}
						$active={activeStep === 50}
					>
						50%
					</Step>
					<Step
						onClick={() => {
							if (disabled) return;
							setAmountPercentage(75);
							setActiveStep(75);
						}}
						$active={activeStep === 75}
					>
						75%
					</Step>
					<Step
						onClick={() => {
							if (disabled) return;
							setAmountPercentage(100);
							setActiveStep(100);
						}}
						$active={activeStep === 100}
					>
						100%
					</Step>
				</PercentageRow>
			)}
		</div>
	);
};

const InputLabelRow = styled(Flex)``;
const InputLabel = styled(GLink)`
	display: flex;
`;
const InputLabelText = styled.div`
	color: ${neutralColors.gray[100]};
`;
const InputLabelValue = styled.div`
	color: ${brandColors.deep[100]};
`;
const InputLabelAction = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;

const PercentageRow = styled(Flex)`
	gap: 8px;
`;

const Step = styled(GLink)<{ $active: boolean }>`
	padding: 8px 16px;
	color: ${props =>
		props.$active ? neutralColors.gray[100] : brandColors.deep[100]};
	background: ${props =>
		props.$active ? brandColors.cyan[500] : brandColors.giv[700]};
	border-radius: 54px;
	cursor: pointer;
	user-select: none;
`;
