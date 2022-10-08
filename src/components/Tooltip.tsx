import {
	CSSProperties,
	FC,
	ReactNode,
	RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
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
	const [style, setStyle] = useState({});
	const el = useRef(document.createElement('div'));
	const childRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// console.log('enter');

		const current = el.current;
		const body = document.querySelector('body') as HTMLElement;

		if (body) {
			body.appendChild(current);
		}
		return () => {
			// console.log('leave');
			body!.removeChild(current);
		};
	}, []);

	useEffect(() => {
		if (!parentRef.current) return;
		if (!childRef.current) return;
		const childRect = childRef.current.getBoundingClientRect();
		console.log('childRef');
		setStyle(tooltipStyleCalc(parentRef, { direction, align }));
	}, [align, direction, parentRef, childRef]);

	return createPortal(
		<TooltipContainer
			ref={childRef}
			style={style}
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
				transform: `translate(calc(-50% + ${
					parentPosition.width / 2
				}px), calc(-100% - 16px))`,
			};
			break;
		case 'bottom':
			style = {
				top: parentPosition.bottom,
				left: parentPosition.left,
				transform: `translate(calc(-50% + ${
					parentPosition.width / 2
				}px), 4px)`,
			};
			break;
		case 'right':
			style = {
				top: parentPosition.bottom,
				left: parentPosition.right,
				transform: `translate(4px, calc(-50% - ${
					parentPosition.height / 2
				}px))`,
			};
			break;
		case 'left':
			style = {
				top: parentPosition.bottom,
				left: parentPosition.left,
				transform: `translate(calc(-100% - 8px), calc(-50% - ${
					parentPosition.height / 2
				}px))`,
			};
			break;
	}
	// console.log('style', style);

	return style;
};

const TooltipContainer = styled.div<ITooltipDirection>`
	position: fixed;
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
