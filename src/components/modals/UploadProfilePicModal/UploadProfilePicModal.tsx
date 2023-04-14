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
			headerTitle='Upload An Image or Givers NFT'
			headerTitlePosition='left'
		>
			<SetProfilePic closeModal={closeModal} />
		</Modal>
	);
};

export default UploadProfilePicModal;
