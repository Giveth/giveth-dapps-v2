import {
	brandColors,
	GLink,
	IconChevronDown24,
} from '@giveth/ui-design-system';
import { FC, ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { zIndex } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import { HeaderLink } from '../Header/Header.sc';
import { useDelayedState } from '@/hooks/useDelayedState';
import { ItemsProvider, useItemsContext } from '@/context/Items.context';
import { FlexCenter } from '../styled-components/Flex';
import { ETheme } from '@/features/general/general.slice';

interface ILinkWithMenu {
	title: string;
	children: ReactNode;
	isHeaderShowing: boolean;
}

export const LinkWithMenu: FC<ILinkWithMenu> = ({
	title,
	isHeaderShowing,
	children,
}) => {
	const elRef = useRef<HTMLDivElement>(null);
	const theme = useAppSelector(state => state.general.theme);
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();

	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
		}
	}, [isHeaderShowing]);

	return (
		<>
			<LinkWrapper
				ref={elRef}
				theme={theme}
				onMouseEnter={openMenu}
				isOpen={showMenu}
			>
				<GLink size='Big'>{title}</GLink>
				<ArrowContainer up={showMenu}>
					<IconChevronDown24 />
				</ArrowContainer>
			</LinkWrapper>
			{menuCondition && (
				<ItemsProvider close={closeMenu}>
					<Menu
						isAnimating={showMenu}
						parentRef={elRef}
						menuCondition={menuCondition}
					>
						{children}
					</Menu>
				</ItemsProvider>
			)}
		</>
	);
};

const LinkWrapper = styled(HeaderLink)<{ isOpen?: boolean }>`
	padding: 10px 42px 10px 16px;
	cursor: pointer;
	position: relative;
	${props =>
		props.isOpen &&
		css`
			background-color: ${props =>
				props.theme === ETheme.Dark
					? brandColors.giv[300]
					: brandColors.giv[50]};
		`}
`;

const ArrowContainer = styled.span<{ up: boolean }>`
	position: relative;
	margin-left: 10px;
	width: 24px;
	height: 24px;
	display: inline-block;
	transition: transform 0.3s ease;
	transform: ${props => (props.up ? 'rotate(-180deg)' : 'rotate(0deg)')};
	position: absolute;
	top: 9px;
	right: 10px;
`;

interface IMenuProps {
	parentRef: RefObject<HTMLDivElement>;
	isAnimating: boolean;
	menuCondition: boolean;
	children: ReactNode;
}

export const Menu: FC<IMenuProps> = ({
	parentRef,
	isAnimating,
	menuCondition,
	children,
}) => {
	const el = useRef(document.createElement('div'));
	const { close } = useItemsContext();

	useEffect(() => {
		const current = el.current;
		const body = document.querySelector('body') as HTMLElement;

		if (body) {
			body.appendChild(current);
		}
		return () => {
			body!.removeChild(current);
		};
	}, []);

	return createPortal(
		<>
			{menuCondition && isAnimating && (
				<>
					<Background
						onMouseOver={() => {
							console.log('enter!!!!');
							close();
						}}
					/>
					<Ajab
						style={{
							top: parentRef?.current?.getBoundingClientRect()
								.top,
							left: parentRef?.current?.getBoundingClientRect()
								.left,
							width: parentRef?.current?.getBoundingClientRect()
								.width,
							height: parentRef?.current?.getBoundingClientRect()
								.height,
						}}
					/>
				</>
			)}
			<MenuContainer
				onMouseOver={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
				isAnimating={isAnimating}
				style={{
					top: parentRef?.current?.getBoundingClientRect().bottom,
					left: parentRef?.current?.getBoundingClientRect().left,
				}}
			>
				{children}
			</MenuContainer>
		</>,
		el.current,
	);
};

const MenuContainer = styled.div<{ isAnimating: boolean }>`
	position: fixed;
	color: #fff;
	border-radius: 6px;
	padding: 10px 0;
	z-index: ${zIndex.HEADER + 1};
	top: -2px;
	left: 0;
	opacity: ${props => (props.isAnimating ? 1 : 0)};
	transition: opacity 0.3s ease;
`;

const Ajab = styled.div`
	position: absolute;
	z-index: ${zIndex.HEADER + 1};
	cursor: pointer;
`;

const Background = styled(FlexCenter)`
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: ${zIndex.HEADER + 1};
`;
