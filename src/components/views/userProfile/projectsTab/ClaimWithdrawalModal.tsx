import { P, brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { Flex } from '@/components/styled-components/Flex';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IStreamWithBalance } from '@/hooks/useProjectClaimableDonations';

interface IClaimWithdrawalModal extends IModal {
	selectedStreams: IStreamWithBalance | IStreamWithBalance[];
}

const ClaimWithdrawalModal = ({
	setShowModal,
	selectedStreams,
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
			<ModalContainer>123</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	min-width: 650px;
`;

const ItemContainer = styled(Flex)`
	padding: 8px;
	border-radius: 8px;
	:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

const ClaimButton = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const TotalAmountContainer = styled.div`
	padding: 8px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
`;

const SuperfluidLogoContainer = styled(Flex)`
	margin-top: 32px;
`;

export default ClaimWithdrawalModal;
