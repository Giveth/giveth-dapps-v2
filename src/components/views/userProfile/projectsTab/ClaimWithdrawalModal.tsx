import styled from 'styled-components';
import { Button } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import ClaimWithdrawalItem from './ClaimWithdrawalItem';

interface IClaimWithdrawalModal extends IModal {
	selectedStream: ITokenWithBalance;
	projectName: string;
}

const ClaimWithdrawalModal = ({
	setShowModal,
	selectedStream,
	projectName,
}: IClaimWithdrawalModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	console.log('Selected Streams', selectedStream);
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Confirm your withdrawal'
			headerTitlePosition='left'
			hiddenClose
		>
			<ModalContainer>
				<ClaimWithdrawalItem
					projectName={projectName}
					stream={selectedStream}
				/>

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
`;

export default ClaimWithdrawalModal;
