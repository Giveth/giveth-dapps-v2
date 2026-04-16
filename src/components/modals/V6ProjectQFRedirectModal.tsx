import { FC } from 'react';
import styled from 'styled-components';
import { Caption } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import {
	ConfirmButton,
	DescToast,
	NotNowButton,
} from '@/components/modals/Boost/BoostModal.sc';

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
				<DescToast>
					<Caption style={{ whiteSpace: `pre-line` }}>
						{formatMessage({
							id: 'label.v6_qf_redirect.body',
						})}
					</Caption>
				</DescToast>
				<ConfirmButton
					label={formatMessage({
						id: 'label.v6_qf_redirect.go_to_qf_project_page',
					})}
					size='small'
					onClick={() => {
						window.location.assign(redirectUrl);
					}}
				/>
				<NotNowButton
					buttonType='texty-primary'
					label={formatMessage({
						id: 'label.cancel',
					})}
					onClick={closeModal}
				/>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	width: 100%;
	transition:
		width 0.2s ease,
		height 0.2s ease;
	${mediaQueries.tablet} {
		width: 480px;
	}
	padding: 24px;
`;

export default V6ProjectQFRedirectModal;
