import { FC } from 'react';
import styled from 'styled-components';
import { Button, P } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';

interface IV6ProjectQFRedirectModalProps extends IModal {
	redirectUrl: string;
}

export const V6ProjectQFRedirectModal: FC<IV6ProjectQFRedirectModalProps> = ({
	setShowModal,
	redirectUrl,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.v6_qf_redirect.title',
			})}
			headerTitlePosition='left'
			hiddenClose
			doNotCloseOnClickOutside
		>
			<ModalContainer>
				<Description>
					{formatMessage({
						id: 'label.v6_qf_redirect.body',
					})}
				</Description>
				<Buttons>
					<PrimaryButton
						buttonType='primary'
						label={formatMessage({
							id: 'label.v6_qf_redirect.go_to_qf_project_page',
						})}
						onClick={() => {
							window.location.assign(redirectUrl);
						}}
					/>
					<SecondaryButton
						buttonType='secondary'
						label={formatMessage({
							id: 'label.cancel',
						})}
						onClick={closeModal}
					/>
				</Buttons>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	width: 100%;

	${mediaQueries.tablet} {
		width: 494px;
	}
`;

const Description = styled(P)`
	margin: 0 0 24px;
	text-align: left;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const PrimaryButton = styled(Button)``;

const SecondaryButton = styled(Button)``;

export default V6ProjectQFRedirectModal;
