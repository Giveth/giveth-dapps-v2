import {
	Flex,
	IconAlertTriangleOutline32,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { type FC } from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

enum EEndStreamSteps {
	CONFIRM,
	SUCCESS,
}

export interface IEndStreamModalProps extends IModal {}

export const EndStreamModal: FC<IEndStreamModalProps> = ({ ...props }) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.end_recurring_donation',
			})}
			headerTitlePosition='left'
			headerIcon={<IconAlertTriangleOutline32 />}
		>
			<Wrapper>
				<InlineToast
					type={EToastType.Error}
					message='You’re about to end an active recurring donation. This project will no longer benefit from your continuous support. Are you sure? '
				/>
			</Wrapper>
		</Modal>
	);
};

const Wrapper = styled(Flex)`
	text-align: left;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 430px;
	}
`;
