import { IconDonation32 } from '@giveth/ui-design-system';
import { FC, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import config from '@/configuration';
import { useUserStreams } from '@/hooks/useUserStreams';
import { ModifyStreamInnerModal } from './ModifyStreamInnerModal';
import { UpdateStreamInnerModal } from './UpdateStreamInnerModal';
import { IToken } from '@/types/superFluid';

export enum EDonationSteps {
	MODIFY,
	CONFIRM,
	DONATING,
	SUCCESS,
}

export interface IModifyDonationInfo {
	superTokenBalance: bigint;
	flowRatePerMonth: bigint;
	streamFlowRatePerMonth: bigint;
	token: IToken;
}

export interface IModifyStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
	refetch: () => void;
	recurringNetworkId: number;
}

export const ModifyStreamModal: FC<IModifyStreamModalProps> = ({
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.MODIFY);
	const [modifyInfo, setModifyInfo] = useState<IModifyDonationInfo>();
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();
	const { tokenStreams } = useUserStreams();

	const superToken = useMemo(() => {
		if (props.recurringNetworkId === config.OPTIMISM_NETWORK_NUMBER) {
			return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
				s => s.underlyingToken.symbol === props.donation.currency,
			);
		}
		return config.BASE_CONFIG.SUPER_FLUID_TOKENS.find(
			s => s.underlyingToken.symbol === props.donation.currency,
		);
	}, [props.recurringNetworkId, props.donation.currency]);

	const handleCloseModal = () => {
		if (step === EDonationSteps.SUCCESS) {
			props.refetch();
		}
		closeModal();
	};

	return (
		<Modal
			closeModal={handleCloseModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.modify_recurring_donation_amount',
			})}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
		>
			{step === EDonationSteps.MODIFY ? (
				<ModifyStreamInnerModal
					{...props}
					setStep={setStep}
					tokenStreams={tokenStreams}
					superToken={superToken!}
					setModifyInfo={setModifyInfo}
					recurringNetworkId={props.recurringNetworkId}
				/>
			) : (
				<UpdateStreamInnerModal
					step={step}
					setStep={setStep}
					superTokenBalance={modifyInfo?.superTokenBalance!}
					flowRatePerMonth={modifyInfo?.flowRatePerMonth!}
					streamFlowRatePerMonth={modifyInfo?.streamFlowRatePerMonth!}
					token={modifyInfo?.token!}
					closeModal={handleCloseModal}
					{...props}
					recurringNetworkId={props.recurringNetworkId}
				/>
			)}
		</Modal>
	);
};
