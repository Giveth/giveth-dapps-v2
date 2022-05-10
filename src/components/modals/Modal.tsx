import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import {
	ModalHeader,
	ModalHeaderTitlePosition,
} from '@/components/modals/ModalHeader';
import { ETheme, useGeneral } from '@/context/general.context';
import { zIndex } from '@/lib/constants/constants';

const Scrollbars = dynamic(() => import('react-custom-scrollbars'), {
	ssr: false,
});

interface ModalWrapperProps {
	fullScreen?: boolean;
}

interface IModal extends ModalWrapperProps {
	fullScreen?: boolean;
	setShowModal: (value: boolean) => void;
	callback?: () => void;
	hiddenClose?: boolean;
	hiddenHeader?: boolean;
	headerTitlePosition?: ModalHeaderTitlePosition;
	headerTitle?: string;
	headerIcon?: ReactNode;
	customTheme?: ETheme;
}

export const Modal: FC<IModal> = ({
	hiddenClose = false,
	hiddenHeader = false,
	setShowModal,
	children,
	headerTitlePosition,
	headerTitle,
	headerIcon,
	customTheme,
	fullScreen = false,
}) => {
	const el = useRef(document.createElement('div'));
	const { theme } = useGeneral();

	useEffect(() => {
		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		modalRoot.style.overflowY = 'hidden';
		if (modalRoot) {
			modalRoot.addEventListener('keydown', handleKeyDown);
			modalRoot.appendChild(current);
		}
		return () => {
			modalRoot.removeEventListener('keydown', handleKeyDown);
			modalRoot.style.overflowY = 'unset';
			modalRoot!.removeChild(current);
		};
	}, []);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setShowModal(false);
		}
	};

	const ScrollBarsNotFullScreenProps = {
		autoHeight: true,
		autoHeightMin: 'calc(20Vh - 60px)',
		autoHeightMax: 'calc(80Vh - 60px)',
	};

	return createPortal(
		<Background>
			<Surrounding onClick={() => setShowModal(false)} />
			<ModalWrapper fullScreen={fullScreen} theme={customTheme || theme}>
				<ModalHeader
					hiddenClose={hiddenClose}
					hiddenHeader={hiddenHeader}
					title={headerTitle}
					icon={headerIcon}
					closeModal={() => setShowModal(false)}
					position={headerTitlePosition}
				/>
				<Scrollbars
					renderTrackHorizontal={props => (
						<div {...props} style={{ display: 'none' }} />
					)}
					{...(fullScreen ? {} : ScrollBarsNotFullScreenProps)}
				>
					{children}
				</Scrollbars>
			</ModalWrapper>
		</Background>,
		el.current,
	);
};

const Surrounding = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
`;

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
	z-index: ${zIndex.MODAL};
`;

const ModalWrapper = styled.div<ModalWrapperProps>`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	box-shadow: 0 3px 20px
		${props => (props.theme === ETheme.Dark ? '#00000026' : '#21203c')};
	border-radius: ${props => (props.fullScreen ? 0 : '8px')};
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: brandColors.deep[900]};
	position: relative;
	z-index: 10;
	text-align: center;
	max-height: ${props => (props.fullScreen ? 'none' : '90vh')};
	width: ${props => (props.fullScreen ? '100%' : 'auto')};
	height: ${props => (props.fullScreen ? '100%' : 'auto')};
	overflow: hidden;
`;
