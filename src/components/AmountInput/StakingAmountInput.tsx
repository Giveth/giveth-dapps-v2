import { type FC } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { StakingPlatform, type PoolStakingConfig } from '@/types/config';
import { AmountInput, IAmountInput } from './AmountInput';

interface IStakingAmountInputProps extends IAmountInput {
	poolStakingConfig: PoolStakingConfig;
}

export const StakingAmountInput: FC<IStakingAmountInputProps> = ({
	poolStakingConfig,
	...props
}) => {
	return (
		<NumericalInput
			{...props}
			showPercentage={true}
			showMax={true}
			balanceUnit={`${poolStakingConfig.title}
  &nbsp;
  ${poolStakingConfig.platform !== StakingPlatform.GIVETH && 'LP'}`}
		/>
	);
};

const NumericalInput = styled(AmountInput)`
	#amount-input {
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

		${props => (props.disabled ? `color: ${brandColors.giv[300]};` : '')}
	}
`;
