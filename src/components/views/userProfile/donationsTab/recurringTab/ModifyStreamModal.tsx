import { IconDonation32 } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { IWalletRecurringDonation } from '@/apollo/types/types';

interface IModifyStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
}

export const ModifyStreamModal: FC<IModifyStreamModalProps> = ({
	...props
}) => {
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
			<ModifyStreamInnerModal {...props} />
		</Modal>
	);
};

const ModifyStreamInnerModal: FC<IModifyStreamModalProps> = ({ donation }) => {
	console.log('donation', donation);
	return <div>ModifyStreamInnerModal</div>;
};
