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
		const parentRect = parentRef.current.getBoundingClientRect();
		const childRect = childRef.current.getBoundingClientRect();
		setStyle(tooltipStyleCalc(parentRect, childRect, { direction, align }));
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
	parentRect: DOMRect,
	childRect: DOMRect,
	position: ITooltipDirection,
): CSSProperties => {
	const { align, direction } = position;
	let style = {};
	console.log('position', position);
	switch (direction) {
		case 'top':
			style = {
				top: parentRect.top,
				left: parentRect.left,
				transform: `translate(calc(-50% + ${
					parentRect.width / 2
				}px), calc(-100% - 16px))`,
			};
			break;
		case 'bottom':
			style = {
				top: parentRect.bottom,
				left: parentRect.left,
				transform: `translate(calc(-50% + ${
					parentRect.width / 2
				}px), 4px)`,
			};
			break;
		case 'right':
			style = {
				top: parentRect.bottom,
				left: parentRect.right,
				transform: `translate(4px, calc(-50% - ${
					parentRect.height / 2
				}px))`,
			};
			break;
		case 'left':
			style = {
				top: parentRect.bottom,
				left: parentRect.left,
				transform: `translate(calc(-100% - 8px), calc(-50% - ${
					parentRect.height / 2
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
`;
