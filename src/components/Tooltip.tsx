import { FC, ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface ITooltipProps {
	ParentRef: RefObject<HTMLDivElement>;
	children: ReactNode;
}

export const Tooltip: FC<ITooltipProps> = ({ ParentRef, children }) => {
	const el = useRef(document.createElement('div'));
	const childRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		console.log('enter');

		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		const size = ParentRef.current?.getBoundingClientRect();
		console.log('ParentRef', size);

		if (modalRoot) {
			modalRoot.appendChild(current);
		}
		return () => {
			console.log('leave');
			modalRoot!.removeChild(current);
		};
	}, []);

	useEffect(() => {
		if (!childRef.current) return;
		const size = childRef.current.getBoundingClientRect();
		console.log('size', size);
	}, [children]);

	return createPortal(
		<TooltipContainer ref={childRef}>{children}</TooltipContainer>,
		el.current,
	);
};

const TooltipContainer = styled.div`
	position: fixed;
	background-color: red;
	top: 0;
	left: 0;
	padding: 0;
`;
