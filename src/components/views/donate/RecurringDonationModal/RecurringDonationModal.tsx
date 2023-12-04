import { FC, useEffect, useState } from 'react';
import { IconDonation32, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { ITokenStreams } from '../RecurringDonationCard';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';

interface IRecurringDonationModalProps extends IModal {
	tokenStreams: ITokenStreams;
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
}

enum EDonationSteps {
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
				setStep={setStep}
				{...props}
			/>
		</Modal>
	);
};

interface IRecurringDonationInnerModalProps
	extends IRecurringDonationModalProps {
	setStep: (step: EDonationSteps) => void;
}

const RecurringDonationInnerModal: FC<IRecurringDonationInnerModalProps> = ({
	setStep,
	amount,
	percentage,
	donationToGiveth,
}) => {
	const { project, selectedToken } = useDonateData();

	useEffect(() => {}, [selectedToken]);

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;

	return (
		<Wrapper>
			<Items flexDirection='column' gap='16px'>
				{!selectedToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={0n}
						token={selectedToken?.token!}
					/>
				)}
				<Item
					title={`Donate Monthly to ${project.title}`}
					amount={projectPerMonth}
					price={0n}
					token={selectedToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate Monthly to the Giveth DAO'
						amount={givethPerMonth}
						price={0n}
						token={selectedToken?.token!}
					/>
				)}
			</Items>
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
