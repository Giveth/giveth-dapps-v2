import styled from 'styled-components';
import { Modal } from './Modal';
import {
	IWrongNetworkInnerModal,
	WrongNetworkInnerModal,
} from './WrongNetworkInnerModal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import type { IModal } from '@/types/common';
import type { FC } from 'react';
interface IWrongNetworkModal extends IModal, IWrongNetworkInnerModal {}

export const WrongNetworkModal: FC<IWrongNetworkModal> = ({
	text,
	targetNetworks,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating} hiddenClose>
			<WrongNetworkModalContainer>
				<WrongNetworkModalTitle>
					You&apos;re connected to the wrong network!
				</WrongNetworkModalTitle>
				<WrongNetworkInnerModal
					text={text}
					targetNetworks={targetNetworks}
				/>
			</WrongNetworkModalContainer>
		</Modal>
	);
};

const WrongNetworkModalContainer = styled.div`
	padding: 0 30px 20px;
	margin-top: -12px;
`;

const WrongNetworkModalTitle = styled.span`
	font-family: 'Red Hat Text';
	font-size: 24px;
`;
