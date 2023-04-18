import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';

import {
	ModalHeader,
	ModalHeaderTitlePosition,
} from '@/components/modals/ModalHeader';
import { ETheme } from '@/features/general/general.slice';
import { mediaQueries, zIndex } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import useDetectDevice from '@/hooks/useDetectDevice';
import { FlexCenter } from '@/components/styled-components/Flex';

interface ModalWrapperProps {
	fullScreen?: boolean;
}

interface IModal {
	fullScreen?: boolean;
	closeModal: () => void;
	callback?: () => void;
	isAnimating: boolean;
	hiddenClose?: boolean;
	hiddenHeader?: boolean;
	headerTitlePosition?: ModalHeaderTitlePosition;
	headerTitle?: string;
	headerIcon?: ReactNode;
	backButtonCallback?: () => void;
	customTheme?: ETheme;
	headerColor?: string;
	children: ReactNode;
	doNotCloseOnClickOutside?: boolean;
	className?: string;
}

export const Modal: FC<IModal> = ({
	hiddenClose = false,
	hiddenHeader = false,
	closeModal,
	isAnimating,
	children,
	headerTitlePosition,
	headerTitle,
	headerIcon,
	backButtonCallback,
	customTheme,
	fullScreen = false,
	headerColor,
	doNotCloseOnClickOutside,
	className,
}) => {
	const theme = useAppSelector(state => state.general.theme);
	const el = useRef(document.createElement('div'));
	const { isMobile } = useDetectDevice();

	useEffect(() => {
		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		modalRoot.style.overflowY = 'hidden';
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};

		if (modalRoot) {
			modalRoot.addEventListener('keydown', handleKeyDown);
			modalRoot.appendChild(current);
		}
		return () => {
			modalRoot.removeEventListener('keydown', handleKeyDown);
			modalRoot.style.overflowY = 'auto';
			modalRoot.style.overflowY = 'overlay';
			modalRoot!.removeChild(current);
		};
	}, [closeModal]);

	const ScrollBarsNotFullScreenProps = {
		autoHeight: true,
		autoHeightMin: 'calc(20Vh - 60px)',
		autoHeightMax: 'calc(80Vh - 60px)',
	};

	return createPortal(
		<Background
			isAnimating={isAnimating}
			onClick={e => e.stopPropagation()}
		>
			{!doNotCloseOnClickOutside && <Surrounding onClick={closeModal} />}
			<ModalWrapper
				fullScreen={fullScreen}
				theme={customTheme || theme}
				className={className}
			>
				<ModalHeader
					hiddenClose={hiddenClose}
					hiddenHeader={hiddenHeader}
					title={headerTitle}
					icon={headerIcon}
					backButtonCallback={backButtonCallback}
					closeModal={closeModal}
					position={headerTitlePosition}
					color={headerColor}
				/>
				<Scrollbars
					renderTrackHorizontal={props => (
						<div {...props} style={{ display: 'none' }} />
					)}
					{...(fullScreen || isMobile
						? {}
						: ScrollBarsNotFullScreenProps)}
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

const Background = styled(FlexCenter)<{ isAnimating: boolean }>`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	top: 0;
	left: 0;
	z-index: ${zIndex.MODAL};
	opacity: ${props => (props.isAnimating ? 0 : 1)};
	transition: opacity 0.3s ease;
`;

const ModalWrapper = styled.div<ModalWrapperProps>`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: brandColors.deep[900]};
	position: relative;
	z-index: 10;
	text-align: center;
	overflow: hidden;
	height: 100%;
	width: 100%;
	${mediaQueries.tablet} {
		border-radius: ${props => (props.fullScreen ? 0 : '8px')};
		box-shadow: 0 3px 20px
			${props => (props.theme === ETheme.Dark ? '#00000026' : '#21203c')};
		max-height: ${props => (props.fullScreen ? 'none' : '90vh')};
		width: ${props => (props.fullScreen ? '100%' : 'auto')};
		height: ${props => (props.fullScreen ? '100%' : 'auto')};
	}
`;
