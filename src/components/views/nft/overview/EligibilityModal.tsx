import React from 'react';
import {
	brandColors,
	ButtonLink,
	IconAlertTriangleFilled32,
	IconCheckCircleFilled32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IEligibilityModal extends IModal {
	isSuccess: boolean;
}

const EligibilityModal = ({ isSuccess, setShowModal }: IEligibilityModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={
				isSuccess
					? 'Congratulations'
					: 'Address not eligible for early minting!'
			}
			headerTitlePosition='left'
			headerIcon={
				isSuccess ? (
					<IconCheckCircleFilled32 />
				) : (
					<IconAlertTriangleFilled32 />
				)
			}
		>
			<ModalContentContainer>
				{isSuccess === true
					? '"You are eligible to mint your Giver early! Thanks for supporting Giveth"'
					: '"The wallet address input is not eligible for early minting. If you think this is a mistake, please contact the team. Check out our documentation for full details on eligibility."'}
			</ModalContentContainer>
			<CustomizedButtonLink
				linkType='texty-secondary'
				label='LEARN MORE'
			/>
			<br />
			<br />
		</Modal>
	);
};

const ModalContentContainer = styled.div`
	padding: 42px 24px;
	max-width: 445px;
`;

const CustomizedButtonLink = styled(ButtonLink)`
	margin: 0 auto;
	max-width: 150px;
	color: ${brandColors.deep[100]};
`;

export default EligibilityModal;
