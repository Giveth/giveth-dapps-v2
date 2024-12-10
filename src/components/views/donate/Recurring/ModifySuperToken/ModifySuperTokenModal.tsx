import { P, brandColors, neutralColors, Flex } from '@giveth/ui-design-system';
import { type FC, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { DepositSuperToken } from './DepositSuperToken';
import { WithDrawSuperToken } from './WithDrawSuperToken';
import { ISuperToken, ISuperfluidStream, IToken } from '@/types/superFluid';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';
import { EModifySuperTokenSteps } from './common';
import config from '@/configuration';

interface IModifySuperTokenModalProps extends IModal {
	selectedToken: ISuperToken | IToken;
	tokenStreams: ISuperfluidStream[];
	refreshBalance: () => void;
	recurringNetworkID: number;
}

const headerTitleGenerator = (step: EModifySuperTokenSteps) => {
	switch (step) {
		case EModifySuperTokenSteps.MODIFY:
			return 'label.modify_stream_balance';
		case EModifySuperTokenSteps.APPROVE:
		case EModifySuperTokenSteps.APPROVING:
		case EModifySuperTokenSteps.DEPOSIT:
			return 'label.confirm_your_deposit';
		case EModifySuperTokenSteps.DEPOSITING:
			return 'label.depositing';
		case EModifySuperTokenSteps.DEPOSIT_CONFIRMED:
			return 'label.deposit_confirmed';
		case EModifySuperTokenSteps.WITHDRAW:
			return 'label.confirm_your_withdrawal';
		case EModifySuperTokenSteps.WITHDRAWING:
			return 'label.withdrawing';
		case EModifySuperTokenSteps.WITHDRAW_CONFIRMED:
			return 'label.withdraw_confirmed';
	}
};

export const ModifySuperTokenModal: FC<IModifySuperTokenModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EModifySuperTokenSteps.MODIFY);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const _closeModal = () => {
		props.refreshBalance();
		closeModal();
	};

	return (
		<Modal
			closeModal={_closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: headerTitleGenerator(step) })}
			headerTitlePosition='left'
		>
			<ModifySuperTokenInnerModal
				setShowModal={setShowModal}
				step={step}
				setStep={setStep}
				closeModal={_closeModal}
				{...props}
			/>
		</Modal>
	);
};

export interface IModifySuperTokenInnerModalProps
	extends IModifySuperTokenModalProps {
	step: EModifySuperTokenSteps;
	setStep: (step: EModifySuperTokenSteps) => void;
	closeModal: () => void;
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
	const [token, superToken] = useMemo(() => {
		let superTokens: any[] = [];
		if (props.recurringNetworkID === config.OPTIMISM_NETWORK_NUMBER) {
			superTokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;
		} else if (props.recurringNetworkID === config.POLYGON_NETWORK_NUMBER) {
			superTokens = config.BASE_CONFIG.SUPER_FLUID_TOKENS;
		}

		return props.selectedToken.isSuperToken
			? [
					props.selectedToken.underlyingToken ||
						superTokens.find(
							token => token.id === props.selectedToken.id,
						)?.underlyingToken,
					props.selectedToken as ISuperToken,
				]
			: [
					props.selectedToken,
					findSuperTokenByTokenAddress(
						props.selectedToken.id,
						props.recurringNetworkID,
					),
				];
	}, [props.selectedToken, props.recurringNetworkID]);

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
							$active={tab === value}
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
	$active: boolean;
}

const Tab = styled(P)<ITapProps>`
	cursor: pointer;
	color: ${neutralColors.gray[700]};
	padding: 8px 16px;
	border-radius: 50px;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
	${props =>
		props.$active &&
		css`
			background-color: ${neutralColors.gray[200]};
			color: ${brandColors.pinky[500]};
			font-weight: 500;
		`};
`;
