import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import { BigNumber, utils } from 'ethers';
import { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import { formatWeiHelper } from '@/helpers/number';
import { PoolStakingConfig, StakingPlatform } from '@/types/config';
import { Flex } from './styled-components/Flex';
import { NumericalInput } from '@/components/input/index';

interface IAmountInput {
	maxAmount: BigNumber;
	setAmount: Dispatch<SetStateAction<string>>;
	poolStakingConfig: PoolStakingConfig;
	disabled?: boolean;
}

export const AmountInput: FC<IAmountInput> = ({
	maxAmount,
	setAmount,
	poolStakingConfig,
	disabled = false,
}) => {
	const { formatMessage } = useIntl();
	const [displayAmount, setDisplayAmount] = useState('');
	const [activeStep, setActiveStep] = useState(0);

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			const newAmount = BigNumber.from(maxAmount)
				.mul(percentage)
				.div(100)
				.toString();
			setAmount(newAmount);
			setDisplayAmount(utils.formatEther(newAmount));
		},
		[maxAmount],
	);

	const onUserInput = useCallback((value: string) => {
		setDisplayAmount(value);
		setActiveStep(0);
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
		<>
			<InputLabelRow justifyContent='space-between'>
				<InputLabel>
					<InputLabelText>
						{formatMessage({ id: 'label.available' })}:{' '}
					</InputLabelText>
					<InputLabelValue>
						&nbsp;
						{formatWeiHelper(maxAmount)}
						&nbsp;
						{poolStakingConfig.title}
						&nbsp;
						{poolStakingConfig.platform !==
							StakingPlatform.GIVETH && 'LP'}
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
			<NumericalInput
				value={displayAmount}
				onUserInput={onUserInput}
				disabled={disabled}
			/>
			<FiltersRow>
				<Step
					onClick={() => {
						if (disabled) return;
						setAmountPercentage(25);
						setActiveStep(25);
					}}
					active={activeStep === 25}
				>
					25%
				</Step>
				<Step
					onClick={() => {
						if (disabled) return;
						setAmountPercentage(50);
						setActiveStep(50);
					}}
					active={activeStep === 50}
				>
					50%
				</Step>
				<Step
					onClick={() => {
						if (disabled) return;
						setAmountPercentage(75);
						setActiveStep(75);
					}}
					active={activeStep === 75}
				>
					75%
				</Step>
				<Step
					onClick={() => {
						if (disabled) return;
						setAmountPercentage(100);
						setActiveStep(100);
					}}
					active={activeStep === 100}
				>
					100%
				</Step>
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
const InputLabelValue = styled.div`
	color: ${brandColors.deep[100]};
`;
const InputLabelAction = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;

const FiltersRow = styled(Flex)`
	gap: 8px;
`;

const Step = styled(GLink)<{ active: boolean }>`
	padding: 8px 16px;
	color: ${props =>
		props.active ? neutralColors.gray[100] : brandColors.deep[100]};
	background: ${props =>
		props.active ? brandColors.cyan[500] : brandColors.giv[700]};
	border-radius: 54px;
	cursor: pointer;
`;
