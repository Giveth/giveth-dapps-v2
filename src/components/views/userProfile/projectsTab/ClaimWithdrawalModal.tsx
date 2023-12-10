import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IStreamWithBalance } from '@/hooks/useProjectClaimableDonations';
import ClaimWithdrawalItem from './ClaimWithdrawalItem';

interface IClaimWithdrawalModal extends IModal {
	selectedStreams: IStreamWithBalance[];
	projectName: string;
}

const ClaimWithdrawalModal = ({
	setShowModal,
	selectedStreams,
	projectName,
}: IClaimWithdrawalModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	console.log('Selected Streams', selectedStreams);
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Confirm your withdrawal'
			headerTitlePosition='left'
			hiddenClose
		>
			<ModalContainer>
				{selectedStreams.map((item, index) => (
					<ClaimWithdrawalItem
						key={index}
						projectName={projectName}
						stream={item}
					/>
				))}
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

export default ClaimWithdrawalModal;
