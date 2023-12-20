import { P, brandColors, neutralColors } from '@giveth/ui-design-system';
import { type FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { DepositSuperToken } from './DepositSuperToken';
import { WithDrawSuperToken } from './WithDrawSuperToken';

interface IModifySuperTokenModalProps extends IModal {}

export enum EModifySuperTokenSteps {
	MODIFY,
	APPROVE,
	APPROVING,
	DEPOSIT,
	DEPOSITING,
	WITHDRAW,
	WITHDRAWING,
	SUBMITTED,
}

const headerTitleGenerator = (step: EModifySuperTokenSteps) => {
	switch (step) {
		case EModifySuperTokenSteps.MODIFY:
			return 'Modify Stream Balance';
		case EModifySuperTokenSteps.APPROVE:
		case EModifySuperTokenSteps.APPROVING:
		case EModifySuperTokenSteps.DEPOSIT:
			return 'Confirm your donation';
		case EModifySuperTokenSteps.DEPOSITING:
			return 'Donating';
		case EModifySuperTokenSteps.SUBMITTED:
			return 'Donation Submitted';
	}
};

export const ModifySuperTokenModal: FC<IModifySuperTokenModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EModifySuperTokenSteps.MODIFY);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={headerTitleGenerator(step)}
			headerTitlePosition='left'
		>
			<ModifySuperTokenInnerModal
				setShowModal={setShowModal}
				step={step}
				setStep={setStep}
				{...props}
			/>
		</Modal>
	);
};

interface IModifySuperTokenInnerModalProps extends IModifySuperTokenModalProps {
	step: EModifySuperTokenSteps;
	setStep: (step: EModifySuperTokenSteps) => void;
}

enum EModifyTabs {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
}

const tabs = [
	{
		label: 'Deposit',
		value: EModifyTabs.DEPOSIT,
	},
	{
		label: 'Withdraw',
		value: EModifyTabs.WITHDRAW,
	},
];

const ModifySuperTokenInnerModal: FC<
	IModifySuperTokenInnerModalProps
> = ({}) => {
	const [tab, setTab] = useState(EModifyTabs.DEPOSIT);
	return (
		<Wrapper>
			<Tabs>
				{tabs.map(({ label, value }) => (
					<Tab
						key={value}
						onClick={() => {
							setTab(value);
						}}
						active={tab === value}
					>
						{label}
					</Tab>
				))}
			</Tabs>
			{tab === EModifyTabs.DEPOSIT && <DepositSuperToken />}
			{tab === EModifyTabs.WITHDRAW && <WithDrawSuperToken />}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	padding: 24px;
	flex-direction: column;
	gap: 24px;
	width: 490px;
`;

const Tabs = styled(Flex)`
	gap: 40px;
`;

interface ITapProps {
	active: boolean;
}

const Tab = styled(P)`
	cursor: pointer;
	color: ${neutralColors.gray[700]};
	padding: 8px 16px;
	border-radius: 50px;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
	${({ active }: ITapProps) =>
		active &&
		css`
			background-color: ${neutralColors.gray[200]};
			color: ${brandColors.pinky[500]};
			font-weight: 500;
		`};
`;
