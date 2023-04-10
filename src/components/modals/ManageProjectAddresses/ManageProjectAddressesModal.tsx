import { B, IconWalletOutline32, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IProject } from '@/apollo/types/types';
import InlineToast from '../../toasts/InlineToast';
import type { IModal } from '@/types/common';

interface IManageProjectAddressesModal extends IModal {
	project: IProject;
}

export const ManageProjectAddressesModal: FC<IManageProjectAddressesModal> = ({
	project,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	console.log('project.address', project.addresses);

	return (
		<Modal
			headerIcon={<IconWalletOutline32 />}
			headerTitle='Add polygon address'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<Content>
					<P>Adding Polygon address for</P>
					<B>{project.title}</B>
				</Content>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	text-align: left;
	padding: 32px 24px 24px;
	${mediaQueries.tablet} {
		width: 556px;
	}
`;

const Content = styled.div`
	margin-bottom: 32px;
	& > div {
		display: inline-block;
		padding-right: 4px;
	}
`;

const StyledInlineToast = styled(InlineToast)`
	margin-top: 0;
`;
