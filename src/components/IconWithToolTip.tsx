import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface IDirection {
	direction: 'right' | 'left' | 'top' | 'bottom';
}

interface IIconWithTooltipProps extends IDirection {
	icon: ReactNode;
}

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
			switch (props.direction) {
				case 'top':
					return `bottom: 120%;left: 50%;transform: translateX(-50%);margin-bottom: 4px;`;
				case 'right':
					return `left: 120%;top: 50%;transform: translateY(-50%);margin-left: 4px;`;
				case 'left':
					return `right: 120%;top: 50%;transform: translateY(-50%);margin-right: 4px;`;
				case 'bottom':
					return `top: 120%;left: 50%;transform: translateX(-50%);margin-top: 4px;`;
				default:
					break;
			}
		}}

		/* Fade in tooltip - takes 1 second to go from 0% to 100% opac: */
		opacity: 0;
		transition: opacity 0.3s;
	}
`;

export const IconWithTooltip: FC<IIconWithTooltipProps> = ({
	icon,
	direction,
	children,
}) => {
	return (
		<IconWithTooltipContainer direction={direction}>
			{icon}
			<span>{children}</span>
		</IconWithTooltipContainer>
	);
};
