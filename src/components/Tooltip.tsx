import { FC, ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { zIndex } from '@/lib/constants/constants';

export interface ITooltipDirection {
	direction: 'right' | 'left' | 'top' | 'bottom';
	align?: 'center' | 'right' | 'left' | 'top' | 'bottom';
}

interface ITooltipProps extends ITooltipDirection {
	parentRef: RefObject<HTMLDivElement>;
	children: ReactNode;
}

export const Tooltip: FC<ITooltipProps> = ({
	parentRef,
	direction,
	align,
	children,
}) => {
	const el = useRef(document.createElement('div'));
	const childRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		console.log('enter');

		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		const size = parentRef.current?.getBoundingClientRect();

		if (modalRoot) {
			modalRoot.appendChild(current);
		}
		return () => {
			console.log('leave');
			modalRoot!.removeChild(current);
		};
	}, [parentRef]);

	// console.log('top', parentRef.current?.getBoundingClientRect().top);
	console.log('height', childRef.current);

	return createPortal(
		<TooltipContainer
			ref={childRef}
			style={{
				top: parentRef.current?.getBoundingClientRect().top,
				left: parentRef.current?.getBoundingClientRect().left,
			}}
			direction={direction}
			align={align}
		>
			{children}
		</TooltipContainer>,
		el.current,
	);
};

const TooltipContainer = styled.div<ITooltipDirection>`
	position: fixed;
	left: 0;
	padding: 0;
	transform: translate(-50%, calc(-100% - 16px));
	background-color: black;
	color: #fff;
	border-radius: 6px;
	padding: 8px;
	z-index: ${zIndex.TOOLTIP};
	/* ${props => {
		let directionStyles;
		let alignStyles;
		switch (props.direction) {
			case 'top':
				directionStyles = `bottom: 120%;margin-bottom: 4px;`;
				switch (props.align) {
					case 'left':
						alignStyles = `left: 0%;`;
						break;
					case 'right':
						alignStyles = `right: 0%;`;
						break;
					default:
						alignStyles = `left: 50%; transform: translateX(-50%);`;
						break;
				}
				return directionStyles + alignStyles;
			case 'right':
				directionStyles = `left: 120%;margin-left: 4px;`;
				switch (props.align) {
					case 'top':
						alignStyles = `top: 0%;`;
						break;
					case 'bottom':
						alignStyles = `bottom: 0%;`;
						break;
					default:
						alignStyles = `top: 50%;transform: translateY(-50%)`;
						break;
				}
				return directionStyles + alignStyles;
			case 'left':
				directionStyles = `right: 120%;margin-right: 4px;`;
				switch (props.align) {
					case 'top':
						alignStyles = `top: 0%;`;
						break;
					case 'bottom':
						alignStyles = `bottom: 0%;`;
						break;
					default:
						alignStyles = `top: 50%;transform: translateY(-50%)`;
						break;
				}
				return directionStyles + alignStyles;
			case 'bottom':
				directionStyles = `top: 120%;margin-top: 4px;`;
				switch (props.align) {
					case 'left':
						alignStyles = `left: 0%;`;
						break;
					case 'right':
						alignStyles = `right: 0%;`;
						break;
					default:
						alignStyles = `left: 50%; transform: translateX(-50%);`;
						break;
				}
				return directionStyles + alignStyles;
			default:
				break;
		}
	}} */
`;
