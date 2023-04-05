import { Modal } from '../Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { SetProfilePic } from '@/components/setProfilePic/SetProfilePic';

interface IUploadProfilePicModal extends IModal {}

const UploadProfilePicModal = ({ setShowModal }: IUploadProfilePicModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Upload Your Images or NFTs'
			headerTitlePosition='left'
		>
			<SetProfilePic />
		</Modal>
	);
};

export default UploadProfilePicModal;
