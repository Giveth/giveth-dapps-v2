import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export const Tooltip = () => {
	const el = useRef(document.createElement('div'));
	useEffect(() => {
		console.log('enter');

		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;

		if (modalRoot) {
			modalRoot.appendChild(current);
		}
		return () => {
			console.log('leave');
			modalRoot!.removeChild(current);
		};
	}, []);

	return createPortal(<TooltipContainer></TooltipContainer>, el.current);
};

const TooltipContainer = styled.div`
	position: fixed;
	background-color: red;
	top: 0;
	left: 0;
	padding: 0;
`;
