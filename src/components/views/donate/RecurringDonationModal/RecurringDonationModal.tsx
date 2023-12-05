import { FC, useEffect, useState } from 'react';
import {
	B,
	Button,
	IconDonation32,
	P,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { ITokenStreams } from '../RecurringDonationCard';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatDate } from '@/lib/helpers';

interface IRecurringDonationModalProps extends IModal {
	tokenStreams: ITokenStreams;
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
}

export enum EDonationSteps {
	APPROVE,
	APPROVING,
	DONATE,
	DONATING,
	SUBMITTED,
}

const headerTitleGenerator = (step: EDonationSteps) => {
	switch (step) {
		case EDonationSteps.APPROVE:
		case EDonationSteps.APPROVING:
		case EDonationSteps.DONATE:
			return 'Confirm your donation';
		case EDonationSteps.DONATING:
			return 'Donating';
		case EDonationSteps.SUBMITTED:
			return 'Donation Submitted';
	}
};

export const RecurringDonationModal: FC<IRecurringDonationModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={headerTitleGenerator(step)}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
		>
			<RecurringDonationInnerModal
				setShowModal={setShowModal}
				step={step}
				setStep={setStep}
				{...props}
			/>
		</Modal>
	);
};

interface IRecurringDonationInnerModalProps
	extends IRecurringDonationModalProps {
	step: EDonationSteps;
	setStep: (step: EDonationSteps) => void;
}

const RecurringDonationInnerModal: FC<IRecurringDonationInnerModalProps> = ({
	step,
	setStep,
	amount,
	percentage,
	donationToGiveth,
}) => {
	const { project, selectedToken } = useDonateData();

	const tokenPrice = useTokenPrice(selectedToken?.token);
	console.log('tokenPrice', tokenPrice);

	useEffect(() => {
		if (!selectedToken) return;
		if (
			selectedToken.token.isSuperToken ||
			selectedToken.token.symbol === 'ETH'
		) {
			setStep(EDonationSteps.DONATE);
		}
	}, [selectedToken, setStep]);

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;
	const totalPerSecond = totalPerMonth / BigInt(30 * 24 * 60 * 60);
	const secondsUntilRunOut = amount / totalPerSecond;
	const date = new Date();
	date.setSeconds(date.getSeconds() + Number(secondsUntilRunOut.toString()));

	return (
		<Wrapper>
			<Items flexDirection='column' gap='16px'>
				{!selectedToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
				<Item
					title={`Donate Monthly to ${project.title}`}
					amount={projectPerMonth}
					price={tokenPrice}
					token={selectedToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate Monthly to the Giveth DAO'
						amount={givethPerMonth}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
			</Items>
			<RunOutSection>
				<P>Your stream balance will run out funds on </P>
				<B>{formatDate(date)}</B>
				<P>Top-up before then!</P>
			</RunOutSection>
			<ApproveButton
				label={'Approve'}
				onClick={() => {
					console.log('selectedToken', selectedToken);
				}}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 430px;
	}
`;

const Items = styled(Flex)`
	max-width: 100%;
`;

const RunOutSection = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	border-top: 1px solid ${neutralColors.gray[600]};
	padding-top: 16px;
	align-items: flex-start;
`;

const ApproveButton = styled(Button)`
	width: 100%;
`;
