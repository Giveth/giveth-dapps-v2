import { Modal } from '../Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	ISetProfilePic,
	SetProfilePic,
} from '@/components/setProfilePic/SetProfilePic';

interface IUploadProfilePicModal extends IModal, ISetProfilePic {}

const UploadProfilePicModal = ({
	setShowModal,
	user,
}: IUploadProfilePicModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Upload Your Images or NFTs'
			headerTitlePosition='left'
		>
			<SetProfilePic user={user} />
		</Modal>
	);
};

export default UploadProfilePicModal;
