import styled from 'styled-components';
import { useRef, useState } from 'react';
import { Tooltip } from './Tooltip';
import type { FC, ReactNode } from 'react';

interface IDirection {
	direction: 'right' | 'left' | 'top' | 'bottom';
	align?: 'center' | 'right' | 'left' | 'top' | 'bottom';
}

interface IIconWithTooltipProps extends IDirection {
	icon: ReactNode;
	children: ReactNode;
}

export const IconWithTooltip: FC<IIconWithTooltipProps> = ({
	icon,
	direction,
	align = 'center',
	children,
}) => {
	const [show, setShow] = useState(false);
	const elRef = useRef<HTMLDivElement>(null);

	return (
		<IconWithTooltipContainer
			direction={direction}
			align={align}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			ref={elRef}
		>
			{icon}
			{show && <Tooltip ParentRef={elRef}>{children}</Tooltip>}
		</IconWithTooltipContainer>
	);
};

const IconWithTooltipContainer = styled.div<IDirection>`
	position: relative;
	cursor: pointer;
	&:hover {
		span {
			visibility: visible;
			opacity: 1;
		}
	}
	& > span {
		visibility: hidden;
		background-color: black;
		color: #fff;
		border-radius: 6px;
		padding: 8px;
		position: absolute;
		z-index: 1;
		${props => {
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
		}}
		/* Fade in tooltip - takes 1 second to go from 0% to 100% opac: */
		opacity: 0;
		transition: opacity 0.3s;
	}
`;
