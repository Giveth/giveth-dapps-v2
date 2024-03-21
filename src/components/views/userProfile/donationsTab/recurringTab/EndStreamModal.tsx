import { IconDonation32 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { type FC } from 'react';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

enum EEndStreamSteps {
	CONFIRM,
	SUCCESS,
}

export interface IEndStreamModalProps extends IModal {}

export const EndStreamModal: FC<IEndStreamModalProps> = ({ ...props }) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();

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
			<div>EndStreamModal</div>
		</Modal>
	);
};
