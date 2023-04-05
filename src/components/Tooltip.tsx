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
import { deviceSize, zIndex } from '@/lib/constants/constants';
import useMediaQuery from '@/hooks/useMediaQuery';

export interface ITooltipDirection {
	direction: 'right' | 'left' | 'top' | 'bottom';
	align?: 'center' | 'right' | 'left' | 'top' | 'bottom';
}

interface ITooltipProps extends ITooltipDirection {
	parentRef: RefObject<HTMLDivElement>;
	children: ReactNode;
}

const ARROW_SIZE = 0;

export const Tooltip: FC<ITooltipProps> = ({
	parentRef,
	direction,
	align,
	children,
}) => {
	const [style, setStyle] = useState<CSSProperties>({});
	const el = useRef(document.createElement('div'));
	const childRef = useRef<HTMLDivElement>(null);
	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);

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

	useEffect(() => {
		if (!parentRef.current) return;
		// if (!childRef.current) return;
		if (typeof window === 'undefined') return;
		const parentRect = parentRef.current.getBoundingClientRect();
		const childRect = childRef.current?.getBoundingClientRect();

		const _style = tooltipStyleCalc(
			{
				direction,
				align,
			},
			!!isMobile,
			parentRect,
			childRect,
		);
		setStyle(_style);
	}, [align, direction, parentRef, childRef, isMobile]);

	return createPortal(
		style.top ? (
			<TooltipContainer
				ref={childRef}
				style={style}
				direction={direction}
				align={align}
			>
				{children}
			</TooltipContainer>
		) : null,
		el.current,
	);
};

const translateXForTopBottom = (
	align: ITooltipDirection['align'],
	parentRect: DOMRect,
) => {
	switch (align) {
		case 'right':
			return `-${ARROW_SIZE}px`;

		case 'left':
			return `calc(-100% + ${parentRect.width + ARROW_SIZE}px)`;

		default:
			return `calc(-50% + ${parentRect.width / 2}px)`;
	}
};

const translateYForRightLeft = (
	align: ITooltipDirection['align'],
	parentRect: DOMRect,
) => {
	switch (align) {
		case 'top':
			return `-100%`;
		case 'bottom':
			return `-${parentRect.width + ARROW_SIZE}px`;

		default:
			return `calc(-50% - ${parentRect.height / 2}px)`;
	}
};

const tooltipStyleCalc = (
	position: ITooltipDirection,
	isMobile: Boolean | null,
	parentRect: DOMRect,
	childRect?: DOMRect, // left it here for future usage
): CSSProperties => {
	const { align, direction } = position;
	let style = {};
	let translateX;
	let translateY;
	if (isMobile && direction !== 'bottom') {
		style = {
			top: parentRect.top - ARROW_SIZE - 50,
			left: 10,
			width: '95vw',
		};
	} else if (isMobile && direction === 'bottom') {
		style = {
			top: parentRect.bottom + ARROW_SIZE,
			left: 10,
			width: '95vw',
		};
	} else {
		switch (direction) {
			case 'top':
				translateX = translateXForTopBottom(align, parentRect);
				style = {
					top: parentRect.top - ARROW_SIZE,
					left: parentRect.left,
					transform: `translate(${translateX}, -100%)`,
				};
				break;
			case 'bottom':
				translateX = translateXForTopBottom(align, parentRect);
				style = {
					top: parentRect.bottom + ARROW_SIZE,
					left: parentRect.left,
					transform: `translate(${translateX}, 0)`,
				};
				break;

			case 'right':
				translateY = translateYForRightLeft(align, parentRect);
				style = {
					top: parentRect.bottom,
					left: parentRect.right + ARROW_SIZE,
					transform: `translate(0, ${translateY})`,
				};
				break;
			case 'left':
				translateY = translateYForRightLeft(align, parentRect);
				style = {
					top: parentRect.bottom,
					left: parentRect.left - ARROW_SIZE,
					transform: `translate(-100%, ${translateY})`,
				};
				break;
		}
	}
	return style;
};

const TriangleBase = styled.div`
	position: absolute;
	width: 0;
	height: 0;
	border-style: solid;
`;

const Triangle = styled(TriangleBase)`
	border-width: 0 ${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px;
	border-color: transparent transparent red transparent;
`;

const TooltipContainer = styled.div<ITooltipDirection>`
	position: fixed;
	background-color: black;
	color: #fff;
	border-radius: 6px;
	padding: 8px;
	z-index: ${zIndex.TOOLTIP};
	top: 0;
	left: 0;
`;
