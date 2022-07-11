import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import {
	ModalHeader,
	ModalHeaderTitlePosition,
} from '@/components/modals/ModalHeader';
import { FlexCenter } from '@/components/styled-components/Flex';
import { zIndex } from '@/lib/constants/constants';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { checkUserAgentIsMobile } from '@/hooks/useDeviceDetect';

interface IModalContext {
	closeModal: () => void;
}

const ModalContext = createContext<IModalContext>({
	closeModal: () => {},
});

ModalContext.displayName = 'ModalContext';

export const ModalProvider = ({
	children,
	hiddenClose = false,
	hiddenHeader = false,
	setShowModal,
	headerTitlePosition,
	headerTitle,
	headerIcon,
	customTheme,
	fullScreen = false,
	headerColor,
}: {
	children: ReactNode;
	fullScreen?: boolean;
	setShowModal: (value: boolean) => void;
	callback?: () => void;
	hiddenClose?: boolean;
	hiddenHeader?: boolean;
	headerTitlePosition?: ModalHeaderTitlePosition;
	headerTitle?: string;
	headerIcon?: ReactNode;
	customTheme?: ETheme;
	headerColor?: string;
}) => {
	const theme = useAppSelector(state => state.general.theme);

	const el = useRef(document.createElement('div'));

	const [hiding, setHiding] = useState(true);

	useEffect(() => {
		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		modalRoot.style.overflowY = 'hidden';
		let isMobile = checkUserAgentIsMobile();
		if (!isMobile) {
			modalRoot.style.paddingRight = '15px';
		}
		if (modalRoot) {
			modalRoot.addEventListener('keydown', handleKeyDown);
			modalRoot.appendChild(current);
		}
		return () => {
			modalRoot.removeEventListener('keydown', handleKeyDown);
			modalRoot.style.overflowY = 'unset';
			modalRoot.style.paddingRight = '0';
			modalRoot!.removeChild(current);
		};
	}, []);

	useEffect(() => {
		setHiding(false);
	}, []);

	const closeModal = () => {
		setHiding(true);
		setTimeout(() => {
			setShowModal(false);
		}, 300);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	};

	const ScrollBarsNotFullScreenProps = {
		autoHeight: true,
		autoHeightMin: 'calc(20Vh - 60px)',
		autoHeightMax: 'calc(80Vh - 60px)',
	};

	const contextData: IModalContext = { closeModal };

	return (
		<ModalContext.Provider value={contextData}>
			{createPortal(
				<Background hiding={hiding} onClick={e => e.stopPropagation()}>
					<Surrounding onClick={() => closeModal()} />
					<ModalWrapper
						fullScreen={fullScreen}
						theme={customTheme || theme}
					>
						<ModalHeader
							hiddenClose={hiddenClose}
							hiddenHeader={hiddenHeader}
							title={headerTitle}
							icon={headerIcon}
							closeModal={() => closeModal()}
							position={headerTitlePosition}
							color={headerColor}
						/>
						<Scrollbars
							renderTrackHorizontal={props => (
								<div {...props} style={{ display: 'none' }} />
							)}
							{...(fullScreen
								? {}
								: ScrollBarsNotFullScreenProps)}
						>
							{children}
						</Scrollbars>
					</ModalWrapper>
				</Background>,
				el.current,
			)}
		</ModalContext.Provider>
	);
};

const Surrounding = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
`;

const Background = styled(FlexCenter)<{ hiding: boolean }>`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	top: 0;
	left: 0;
	z-index: ${zIndex.MODAL};
	opacity: ${props => (props.hiding ? 0 : 1)};
	transition: opacity 0.3s ease-in-out;
`;

const ModalWrapper = styled.div<{ fullScreen?: boolean }>`
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

export const ModalConsumer = ModalContext.Consumer;
