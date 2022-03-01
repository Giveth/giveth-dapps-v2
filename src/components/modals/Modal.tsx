import { brandColors, IconX, neutralColors } from '@giveth/ui-design-system';
import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
	ModalHeader,
	ModalHeaderTitlePosition,
} from '@/components/modals/ModalHeader';
import { ETheme, useGeneral } from '@/context/general.context';
export interface IModal {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
	callback?: () => void;
	hiddenClose?: boolean;
	headerTitlePosition?: ModalHeaderTitlePosition;
	headerTitle?: string;
	headerIcon?: ReactNode;
	customTheme?: ETheme;
}

export const Modal: React.FC<IModal> = ({
	hiddenClose = false,
	setShowModal,
	children,
	headerTitlePosition,
	headerTitle,
	headerIcon,
	customTheme,
}) => {
	const el = useRef(document.createElement('div'));
	const { theme } = useGeneral();

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
			<ModalWrapper theme={customTheme || theme}>
				<ModalHeader
					hiddenClose={hiddenClose}
					title={headerTitle}
					icon={headerIcon}
					closeModal={() => setShowModal(false)}
					position={headerTitlePosition}
				/>
				{children}
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
	z-index: 1060;
`;

const ModalWrapper = styled.div`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	box-shadow: 0px 3px 20px #21203c;
	border-radius: 8px;
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: brandColors.deep[900]};
	position: relative;
	// padding: 24px;
	z-index: 10;
	text-align: center;
	max-height: 90vh;
	overflow: hidden;
`;
