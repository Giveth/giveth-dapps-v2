import { type FC } from 'react';
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
		<AmountInput
			{...props}
			showPercentage={true}
			showMax={true}
			balanceUnit={`${poolStakingConfig.title}
  &nbsp;
  ${poolStakingConfig.platform !== StakingPlatform.GIVETH && 'LP'}`}
		/>
	);
};
