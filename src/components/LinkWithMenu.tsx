import { GLink } from '@giveth/ui-design-system';
import { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { zIndex } from '@/lib/constants/constants';

interface ILinkWithMenu {
	title: string;
}

export const LinkWithMenu: FC<ILinkWithMenu> = ({ title }) => {
	const [show, setShow] = useState(false);
	const elRef = useRef<HTMLDivElement>(null);

	return (
		<GLink
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			ref={elRef}
			style={{
				padding: '10px 16px',
				backgroundColor: 'red',
			}}
		>
			{title}
			{show && (
				<Menu parentRef={elRef}>
					<div
						style={{
							padding: '10px 16px',
							backgroundColor: 'red',
						}}
					>
						salam salam salam salam salam salam salam
						<br />
						salam salam salam salam salam salam salam
						<br />
						salam salam salam salam salam salam salam
						<br />
						salam salam salam salam salam salam salam
						<br />
						salam salam salam salam salam salam salam
						<br />
					</div>
				</Menu>
			)}
		</GLink>
	);
};

interface IMenuProps {
	parentRef: RefObject<HTMLDivElement>;
	children: ReactNode;
}

export const Menu: FC<IMenuProps> = ({ parentRef, children }) => {
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

const MenuContainer = styled.div`
	position: fixed;
	color: #fff;
	border-radius: 6px;
	padding: 8px 0;
	z-index: ${zIndex.MODAL};
	top: 0;
	left: 0;
`;
