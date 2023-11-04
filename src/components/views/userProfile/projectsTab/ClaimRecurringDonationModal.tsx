import { IProject } from '@/apollo/types/types';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

interface IClaimRecurringDonationModal extends IModal {
	project: IProject;
}

const ClaimRecurringDonationModal = ({
	setShowModal,
	project,
}: IClaimRecurringDonationModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Claimable Donations'
			hiddenClose
		>
			asd
		</Modal>
	);
};

export default ClaimRecurringDonationModal;
