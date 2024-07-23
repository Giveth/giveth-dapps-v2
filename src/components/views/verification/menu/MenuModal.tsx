import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { B, neutralColors } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import menuList from '@/components/views/verification/menu/menuList';
import { useVerificationData } from '@/context/verification.context';
import { findStepByName } from '@/lib/verification';
import { useModalAnimation } from '@/hooks/useModalAnimation';

const MenuModal: FC<IModal> = ({ setShowModal }) => {
	const { step, setStep, verificationData, isDraft } = useVerificationData();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { lastStep } = verificationData || {};
	const lastStepIndex = findStepByName(lastStep);
	const { formatMessage } = useIntl();

	const handleClick = (index: number) => {
		if (!!lastStepIndex && index <= lastStepIndex + 1) {
			setStep(index);
			closeModal();
		}
	};

	return (
		<Modal
			fullScreen
			hiddenHeader
			closeModal={closeModal}
			isAnimating={isAnimating}
		>
			<Container>
				{menuList.map((item, index) => {
					let isClickable = index != 8; // Do not enable click on last step "Done"
					isClickable = !isDraft ? false : isClickable; // user first time came to verification steps
					return (
						<MenuItem
							onClick={() => isClickable && handleClick(index)}
							$active={step === index}
							$clickable={isClickable}
							key={item.slug}
						>
							{formatMessage({ id: item.label })}
						</MenuItem>
					);
				})}
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 36px 32px;
	text-align: left;
`;

const MenuItem = styled(B)<{ $active: boolean; $clickable: boolean }>`
	margin-bottom: 28px;
	cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
	color: ${props =>
		props.$active ? neutralColors.gray[900] : neutralColors.gray[700]};
`;

export default MenuModal;
