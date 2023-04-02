import { Modal } from '../Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	IUploadSelectProfilePic,
	UploadSelectProfilePic,
} from '@/components/UploadSelectProfilePic';

interface IUploadProfilePicModal extends IModal, IUploadSelectProfilePic {}

const UploadProfilePicModal = ({
	setShowModal,
	user,
	pfpData,
}: IUploadProfilePicModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Upload Your Images or NFTs'
			headerTitlePosition='left'
		>
			<UploadSelectProfilePic user={user} pfpData={pfpData} />
		</Modal>
	);
};

export default UploadProfilePicModal;
