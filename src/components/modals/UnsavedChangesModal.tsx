import { FC } from 'react';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	IconAlertTriangleFilled32,
	Lead,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { FlexCenter } from '@/components/styled-components/Flex';

const UnsavedChangesModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			headerTitle='Unsaved Changes'
			headerIcon={
				<IconAlertTriangleFilled32 color={semanticColors.golden[500]} />
			}
			closeModal={closeModal}
			isAnimating={isAnimating}
		>
			<Wrapper>
				<LeadStyled>
					{formatMessage({ id: 'label.your_unsaved' })}
				</LeadStyled>{' '}
				<ButtonWrapper>
					<Button
						size='small'
						buttonType='texty-gray'
						label={formatMessage({ id: 'label.stay_on_this_page' })}
						onClick={closeModal}
					/>
					<Button
						size='small'
						label={formatMessage({ id: 'label.leave_this_page' })}
						onClick={closeModal}
					/>
				</ButtonWrapper>
			</Wrapper>
		</Modal>
	);
};

const LeadStyled = styled(Lead)`
	margin: 18px 0 60px;
	color: ${brandColors.deep[900]};
`;

const ButtonWrapper = styled(FlexCenter)``;

const Wrapper = styled.div`
	padding: 24px;
	max-width: 560px;
	text-align: left;
`;

export default UnsavedChangesModal;
