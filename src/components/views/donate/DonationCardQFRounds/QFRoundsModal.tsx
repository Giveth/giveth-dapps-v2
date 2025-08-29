import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IQFRound } from '@/components/views/donate/DonationCardQFRounds/DonationCardQFRounds';

interface IQFRoundModalProps extends IModal {
	QFRounds: IQFRound[];
	setShowModal: (show: boolean) => void;
}

export const QFRoundsModal = ({
	QFRounds,
	setShowModal,
}: IQFRoundModalProps) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	return (
		<>
			<Modal
				closeModal={closeModal}
				isAnimating={isAnimating}
				headerTitlePosition='left'
				doNotCloseOnClickOutside
				headerTitle={formatMessage({ id: 'label.qf.select_qf_round' })}
			>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
				<div>QFRoundsModal</div>
			</Modal>
		</>
	);
};
