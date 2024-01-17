import { P, brandColors, neutralColors } from '@giveth/ui-design-system';
import { type FC, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { DepositSuperToken } from './DepositSuperToken';
import { WithDrawSuperToken } from './WithDrawSuperToken';
import { ISuperToken, IToken } from '@/types/superFluid';
import { type ITokenStreams } from '@/context/donate.context';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';

interface IModifySuperTokenModalProps extends IModal {
	selectedToken: IToken;
	tokenStreams: ITokenStreams;
}

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
			return 'label.modify_stream_balance';
		case EModifySuperTokenSteps.APPROVE:
		case EModifySuperTokenSteps.APPROVING:
		case EModifySuperTokenSteps.DEPOSIT:
			return 'label.confirm_your_donation';
		case EModifySuperTokenSteps.DEPOSITING:
			return 'label.donating';
		case EModifySuperTokenSteps.SUBMITTED:
			return 'label.donation_submitted';
	}
};

export const actionButtonLabel = {
	[EModifySuperTokenSteps.MODIFY]: 'label.confirm',
	[EModifySuperTokenSteps.APPROVE]: 'label.approve',
	[EModifySuperTokenSteps.APPROVING]: 'label.approve',
	[EModifySuperTokenSteps.DEPOSIT]: 'label.deposit',
	[EModifySuperTokenSteps.DEPOSITING]: 'label.deposit',
	[EModifySuperTokenSteps.WITHDRAW]: 'label.withdraw',
	[EModifySuperTokenSteps.WITHDRAWING]: 'label.withdraw',
	[EModifySuperTokenSteps.SUBMITTED]: 'label.done',
};

export const ModifySuperTokenModal: FC<IModifySuperTokenModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EModifySuperTokenSteps.MODIFY);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: headerTitleGenerator(step) })}
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

export interface IModifySuperTokenInnerModalProps
	extends IModifySuperTokenModalProps {
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
> = props => {
	const [tab, setTab] = useState(EModifyTabs.DEPOSIT);
	const [token, superToken] = useMemo(
		() =>
			props.selectedToken.isSuperToken
				? [
						props.selectedToken.underlyingToken,
						props.selectedToken as ISuperToken,
					]
				: [
						props.selectedToken,
						findSuperTokenByTokenAddress(props.selectedToken.id),
					],
		[props.selectedToken],
	);
	return (
		<Wrapper>
			{props.step === EModifySuperTokenSteps.MODIFY && (
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
			)}
			{tab === EModifyTabs.DEPOSIT && (
				<DepositSuperToken
					token={token}
					superToken={superToken}
					{...props}
				/>
			)}
			{tab === EModifyTabs.WITHDRAW && (
				<WithDrawSuperToken
					token={token}
					superToken={superToken}
					{...props}
				/>
			)}
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
