import {
	GLink,
	neutralColors,
	brandColors,
	Flex,
} from '@giveth/ui-design-system';
import {
	FC,
	useState,
	useCallback,
	Dispatch,
	SetStateAction,
	useEffect,
} from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import { formatUnits, parseUnits } from 'viem';
import { formatWeiHelper } from '@/helpers/number';
import { BaseInput } from '../input/BaseInput';
import { truncateToDecimalPlaces } from '@/lib/helpers';

export interface IAmountInput {
	amount: bigint;
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
	amount,
	maxAmount,
	setAmount,
	className,
	decimals = 18,
	disabled = false,
	showMax = false,
	showPercentage = false,
}) => {
	const { formatMessage } = useIntl();
	const [activeStep, setActiveStep] = useState(0);
	const [displayAmount, setDisplayAmount] = useState('');

	useEffect(() => {
		// Prevent changing 0.000 to 0
		const regex = /^0(\.0+)?$/;
		const isZero = regex.test(displayAmount);
		if (amount === 0n && isZero) return;

		const maxDecimals = decimals === 8 ? 6 : decimals / 3;

		const _displayAmount = truncateToDecimalPlaces(
			formatUnits(amount, decimals),
			maxDecimals,
		).toString();
		setDisplayAmount(_displayAmount);
	}, [amount, decimals]);

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			if (!maxAmount) return;
			const newAmount =
				percentage === 100
					? maxAmount
					: (maxAmount * BigInt(percentage)) / 100n;

			setAmount(newAmount);
		},
		[maxAmount, setAmount],
	);

	const onUserInput = useCallback(
		(value: string) => {
			const [, _decimals] = value.split('.');

			// Allow more decimals if token has 8 decimals
			if (decimals === 8) {
				if (_decimals?.length > 6) return; // Limit to 8 decimals
			} else {
				if (_decimals?.length > decimals / 3) return; // Limit to 6 or 2 decimals for other tokens
			}
			setDisplayAmount(value);
			setActiveStep(0);

			try {
				if (parseFloat(value) === 0 && !value.includes('.')) {
					setAmount(0n);
					setDisplayAmount('0');
					return;
				}
			} catch (error) {
				console.error('Failed to parse input amount:', error);
			}

			try {
				let valueBn = parseUnits(value, decimals);
				setAmount(valueBn);
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
