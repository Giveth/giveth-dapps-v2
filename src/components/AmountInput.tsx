import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import { BigNumber, utils } from 'ethers';
import { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { formatWeiHelper } from '../helpers/number';
import { PoolStakingConfig } from '../types/config';
import { Row } from './styled-components/Grid';
import { NumericalInput } from './input';
interface IAmountInput {
	maxAmount: BigNumber;
	setAmount: Dispatch<SetStateAction<string>>;
	poolStakingConfig: PoolStakingConfig;
	disabled?: boolean;
}

function valueToBigNumber(value: string) {}

export const AmountInput: FC<IAmountInput> = ({
	maxAmount,
	setAmount,
	poolStakingConfig,
	disabled = false,
}) => {
	const [displayAmount, setDisplayAmount] = useState('');

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			const newAmount = BigNumber.from(maxAmount)
				.mul(percentage)
				.div(100)
				.toString();
			setAmount(newAmount);
			setDisplayAmount(formatWeiHelper(newAmount, 6, false));
		},
		[maxAmount],
	);

	const onUserInput = useCallback(value => {
		setDisplayAmount(value);
		let valueBn = BigNumber.from(0);

		try {
			valueBn = utils.parseUnits(value);
		} catch (error) {
			console.debug(`Failed to parse input amount: "${value}"`, error);
		}

		setAmount(valueBn.toString());
	}, []);

	return (
		<>
			<InputLabelRow justifyContent='space-between'>
				<InputLabel>
					<InputLabelText>Available: </InputLabelText>
					{poolStakingConfig.type === 'Staking' ? (
						<InputLabelValue>
							&nbsp;
							{formatWeiHelper(maxAmount)}
							&nbsp;
							{poolStakingConfig.title}
							&nbsp;
						</InputLabelValue>
					) : (
						<InputLabelValue>
							&nbsp;
							{formatWeiHelper(maxAmount)}
							&nbsp;
							{poolStakingConfig.title}
							&nbsp;LP
						</InputLabelValue>
					)}
				</InputLabel>
				<InputLabelAction
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					Max
				</InputLabelAction>
			</InputLabelRow>
			<NumericalInput value={displayAmount} onUserInput={onUserInput} />
			<FiltersRow>
				<Filter
					onClick={() => {
						setAmountPercentage(25);
					}}
				>
					25%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(50);
					}}
				>
					50%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(75);
					}}
				>
					75%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					100%
				</Filter>
			</FiltersRow>
		</>
	);
};

const InputLabelRow = styled(Row)``;
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

const FiltersRow = styled(Row)`
	gap: 8px;
`;

const Filter = styled(GLink)`
	padding: 8px 16px;
	color: ${brandColors.deep[100]};
	background: ${brandColors.giv[700]};
	border-radius: 54px;
	cursor: pointer;
`;
