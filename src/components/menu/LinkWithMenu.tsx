import { GLink, IconChevronDown24 } from '@giveth/ui-design-system';
import { FC, ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Link from 'next/link';
import { zIndex } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import { HeaderLink } from '../Header/Header.sc';
import { useDelayedState } from '@/hooks/useDelayedState';
import { ItemsProvider } from '@/context/Items.context';

interface ILinkWithMenu {
	title: string;
	children: ReactNode;
	isHeaderShowing: boolean;
	href: string;
}

export const LinkWithMenu: FC<ILinkWithMenu> = ({
	title,
	isHeaderShowing,
	children,
	href,
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
		<Link href={href}>
			<LinkWithMenuContainer
				onMouseEnter={openMenu}
				onMouseLeave={closeMenu}
				ref={elRef}
				theme={theme}
			>
				<GLink size='Big'>{title}</GLink>
				<ArrowContainer up={showMenu}>
					<IconChevronDown24 />
				</ArrowContainer>
				{menuCondition && (
					<ItemsProvider close={closeMenu}>
						<Menu isAnimating={showMenu} parentRef={elRef}>
							{children}
						</Menu>
					</ItemsProvider>
				)}
			</LinkWithMenuContainer>
		</Link>
	);
};

const LinkWithMenuContainer = styled(HeaderLink)`
	padding: 10px 42px 10px 16px;
	cursor: pointer;
	position: relative;
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
	children: ReactNode;
}

export const Menu: FC<IMenuProps> = ({ parentRef, isAnimating, children }) => {
	const el = useRef(document.createElement('div'));

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
		<MenuContainer
			isAnimating={isAnimating}
			style={{
				top: parentRef?.current?.getBoundingClientRect().bottom,
				left: parentRef?.current?.getBoundingClientRect().left,
			}}
		>
			{children}
		</MenuContainer>,
		el.current,
	);
};

const MenuContainer = styled.div<{ isAnimating: boolean }>`
	position: fixed;
	color: #fff;
	border-radius: 6px;
	padding: 8px 0;
	z-index: ${zIndex.MODAL};
	top: 0;
	left: 0;
	opacity: ${props => (props.isAnimating ? 1 : 0)};
	transition: opacity 0.3s ease;
`;
