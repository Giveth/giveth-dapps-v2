import { brandColors, IconX } from '@giveth/ui-design-system';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
export interface IModal {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
	hiddenClose?: boolean;
}

export const Modal: React.FC<IModal> = ({
	hiddenClose = false,
	setShowModal,
	children,
}) => {
	const el = useRef(document.createElement('div'));

	useEffect(() => {
		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		modalRoot.style.overflow = 'hidden';
		if (modalRoot) {
			modalRoot.appendChild(current);
		}
		return () => {
			modalRoot.style.overflow = 'unset';
			modalRoot!.removeChild(current);
		};
	}, []);

	return createPortal(
		<Background>
			<ModalWrapper>
				{children}
				{!hiddenClose && (
					<CloseModalButton onClick={() => setShowModal(false)}>
						<IconX size={24} />
					</CloseModalButton>
				)}
			</ModalWrapper>
		</Background>,
		el.current,
	);
};

const Background = styled.div`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	z-index: 1110;
`;

const ModalWrapper = styled.div`
	background: ${brandColors.giv[600]};
	box-shadow: 0px 3px 20px #21203c;
	border-radius: 8px;
	color: ${brandColors.deep[100]};
	position: relative;
	// padding: 24px;
	z-index: 10;
	text-align: center;
	max-height: 90vh;
	overflow: hidden;
`;

const CloseModalButton = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	cursor: pointer;
`;
