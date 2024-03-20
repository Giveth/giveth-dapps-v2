import React, { FC } from 'react';
import { EDonationSteps, IModifyStreamModalProps } from './ModifyStreamModal';
import { Wrapper } from './ModifyStreamInnerModal';
import { Item } from '@/components/views/donate/RecurringDonationModal/Item';
import { IToken } from '@/types/superFluid';
import { RunOutInfo } from '@/components/views/donate/RunOutInfo';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface IModifyStreamInnerModalProps extends IModifyStreamModalProps {
	step: EDonationSteps;
	setStep: (step: EDonationSteps) => void;
	token: IToken;
	amount: bigint;
	totalPerMonth: bigint;
}

export const UpdateStreamInnerModal: FC<IModifyStreamInnerModalProps> = ({
	donation,
	step,
	setStep,
	token,
	amount,
	totalPerMonth,
}) => {
	const tokenPrice = useTokenPrice(token);
	return (
		<Wrapper>
			<Item
				title={`Donate to ${donation.project.title}`}
				subtext={'per month'}
				amount={amount}
				price={tokenPrice}
				token={token}
			/>
			<RunOutInfo
				amount={amount}
				totalPerMonth={totalPerMonth}
				symbol={token.symbol || ''}
			/>
		</Wrapper>
	);
};
