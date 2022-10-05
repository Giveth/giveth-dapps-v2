import {
	CSSProperties,
	FC,
	ReactNode,
	RefObject,
	useEffect,
	useRef,
} from 'react';
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
		const body = document.querySelector('body') as HTMLElement;

		if (body) {
			body.appendChild(current);
		}
		return () => {
			console.log('leave');
			body!.removeChild(current);
		};
	}, [parentRef]);

	// console.log('top', parentRef.current?.getBoundingClientRect().top);
	console.log('height', childRef.current);

	return createPortal(
		<TooltipContainer
			ref={childRef}
			style={tooltipStyleCalc(parentRef, { direction, align })}
			direction={direction}
			align={align}
		>
			{children}
		</TooltipContainer>,
		el.current,
	);
};

const tooltipStyleCalc = (
	parentRef: RefObject<HTMLDivElement>,
	position: ITooltipDirection,
): CSSProperties => {
	if (!parentRef.current) return {};
	if (typeof window === 'undefined') return {};
	const { align, direction } = position;
	const parentPosition = parentRef.current?.getBoundingClientRect();
	let style = {};
	console.log('position', position);
	switch (direction) {
		case 'top':
			style = {
				top: parentPosition.top,
				left: parentPosition.left,
				transform: `translate(-50%, calc(-100% - 16px))`,
			};
		case 'bottom':
			style = {
				top: parentPosition.bottom,
				left: parentPosition.left,
				transform: `translate(-50%, 4px)`,
			};
	}
	console.log('style', style);

	return style;
};

const TooltipContainer = styled.div<ITooltipDirection>`
	position: fixed;
	left: 0;
	padding: 0;
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
