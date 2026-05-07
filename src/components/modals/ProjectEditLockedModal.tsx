import { Button, H4, P } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Modal } from './Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

export const ProjectEditLockedModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			hiddenClose
			doNotCloseOnClickOutside
			hiddenHeader
		>
			<Container>
				<Title>
					{formatMessage({
						id: 'label.project_edits_temporarily_disabled',
					})}
				</Title>
				<Description>
					{formatMessage({
						id: 'label.project_edits_disabled_ethereum_security_qf',
					})}
				</Description>
				<ButtonWrapper>
					<Button
						label={formatMessage({ id: 'label.got_it' })}
						buttonType='primary'
						onClick={closeModal}
					/>
				</ButtonWrapper>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	width: min(480px, calc(100vw - 48px));
	padding: 32px 24px;
	text-align: center;
`;

const Title = styled(H4)`
	margin-bottom: 16px;
`;

const Description = styled(P)`
	margin-bottom: 24px;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
`;
