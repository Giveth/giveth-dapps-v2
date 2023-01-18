import { brandColors, IconX24, neutralColors } from '@giveth/ui-design-system';
import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { zIndex } from '@/lib/constants/constants';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

export enum ESideBarDirection {
	Left,
	Right,
}

interface ISideBar {
	close: () => void;
	isAnimating: boolean;
	direction: ESideBarDirection;
	showClose?: boolean;
	header?: ReactNode;
	children: ReactNode;
}

export const SideBar: FC<ISideBar> = ({
	close,
	isAnimating,
	direction,
	showClose = true,
	header,
	children,
}) => {
	const theme = useAppSelector(state => state.general.theme);
	const el = useRef(document.createElement('div'));

	useEffect(() => {
		const current = el.current;
		const root = document.querySelector('body') as HTMLElement;
		root.style.overflowY = 'hidden';
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close();
			}
		};

		if (root) {
			root.addEventListener('keydown', handleKeyDown);
			root.appendChild(current);
		}
		return () => {
			root.removeEventListener('keydown', handleKeyDown);
			root.style.overflowY = 'overlay';
			root!.removeChild(current);
		};
	}, []);

	return createPortal(
		<Background
			isAnimating={isAnimating}
			onClick={e => {
				e.stopPropagation();
				close();
			}}
		>
			<SidebarContainer
				isAnimating={isAnimating}
				theme={theme}
				direction={direction}
				onClick={e => {
					e.stopPropagation();
				}}
			>
				<HeaderContainer direction={direction}>
					<HeaderWrapper>{header && header}</HeaderWrapper>
					{showClose && (
						<CloseWrapper onClick={close} direction={direction}>
							<IconX24 />
						</CloseWrapper>
					)}
				</HeaderContainer>
				{children}
			</SidebarContainer>
		</Background>,
		el.current,
	);
};

const Background = styled(FlexCenter)<{ isAnimating: boolean }>`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	top: 0;
	left: 0;
	z-index: ${zIndex.MODAL};
	opacity: 0;
	opacity: ${props => (props.isAnimating ? 1 : 0)};
	transition: opacity 0.3s ease;
`;

const SidebarContainer = styled.div<{
	isAnimating: boolean;
	direction: ESideBarDirection;
}>`
	width: 353px;
	height: 100%;
	overflow-y: overlay;
	background: ${brandColors.giv[900]};
	position: fixed;
	top: 0;
	z-index: ${zIndex.MODAL};
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
	${props => {
		const key =
			props.direction === ESideBarDirection.Left ? 'left' : 'right';
		return css<{ isAnimating: boolean }>`
			${key}: 0;
			${key}: ${props => (props.isAnimating ? 0 : '-353px')};
			transition: ${key} 0.3s ease;
		`;
	}};
	user-select: none;
`;

const HeaderContainer = styled(Flex)<{ direction: ESideBarDirection }>`
	padding: 8px 16px;
	position: relative;
	height: 64px;
	flex-direction: ${props =>
		props.direction === ESideBarDirection.Left ? 'row' : 'row-reverse'};
`;

const HeaderWrapper = styled(Flex)`
	flex: 1;
`;

const CloseWrapper = styled.div<{ direction: ESideBarDirection }>`
	padding: 12px;
	cursor: pointer;
`;
