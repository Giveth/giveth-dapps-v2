import { FC } from 'react';
import styled from 'styled-components';
import { Button, Lead, IconTrash } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

interface IProps extends IModal {
	callback: () => void;
}

export const RemoveUpdateModal: FC<IProps> = ({ setShowModal, callback }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconTrash size={24} />}
			headerTitle='Removing Update'
			headerTitlePosition='left'
		>
			<Container>
				<Description>
					Are you sure you want to remove this update?
				</Description>
				<InlineToast
					message="You can't undo this action"
					type={EToastType.Warning}
				/>
				<OkButton
					label='YES, REMOVE IT'
					onClick={callback}
					buttonType={'primary'}
				/>
				<NoButton
					label='CANCEL'
					onClick={closeModal}
					buttonType={'texty'}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	height: 300px;
	padding: 19px;
	text-align: left;
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const NoButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 0 auto;
	:hover {
		background: transparent;
	}
`;

const Description = styled(Lead)`
	margin: 24px 0;
`;
