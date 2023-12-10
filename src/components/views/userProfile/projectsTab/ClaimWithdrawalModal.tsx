import styled from 'styled-components';
import { Button } from '@giveth/ui-design-system';
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
				<br />
				<FullWidthButton
					label='Confirm'
					onClick={() => {
						console.log('Clicked');
					}}
					style={{ width: '100%' }}
				/>
			</ModalContainer>
		</Modal>
	);
};

const FullWidthButton = styled(Button)`
	width: 100%;
`;

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

export default ClaimWithdrawalModal;
