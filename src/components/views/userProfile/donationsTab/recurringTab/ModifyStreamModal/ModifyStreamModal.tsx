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

export enum EDonationSteps {
	MODIFY,
	CONFIRM,
	DONATING,
	SUCCESS,
}

export interface IModifyStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
}

export const ModifyStreamModal: FC<IModifyStreamModalProps> = ({
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.MODIFY);
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();
	const tokenStreams = useUserStreams();

	const superToken = useMemo(
		() =>
			config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
				s => s.underlyingToken.symbol === props.donation.currency,
			),
		[props.donation.currency],
	);

	return (
		<Modal
			closeModal={closeModal}
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
				/>
			) : (
				<UpdateStreamInnerModal />
			)}
		</Modal>
	);
};
