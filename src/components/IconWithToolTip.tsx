import styled from 'styled-components';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { ITooltipDirection, Tooltip } from './Tooltip';
import type { FC, ReactNode } from 'react';

interface IIconWithTooltipProps extends ITooltipDirection {
	icon: ReactNode;
	children: ReactNode;
	style?: CSSProperties;
}

export const IconWithTooltip: FC<IIconWithTooltipProps> = ({
	icon,
	direction,
	align = 'center',
	children,
	style,
}) => {
	const [show, setShow] = useState(false);
	const elRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleRemoveTooltip() {
			setShow(false);
		}
		window.addEventListener('scroll', handleRemoveTooltip);

		return () => {
			window.removeEventListener('scroll', handleRemoveTooltip);
		};
	}, []);

	return (
		<IconWithTooltipContainer
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			onClick={e => {
				e.stopPropagation(); // make tooltip content clickable without affecting parent
			}}
			ref={elRef}
			style={style}
		>
			{icon}
			{show && (
				<Tooltip direction={direction} align={align} parentRef={elRef}>
					{children}
				</Tooltip>
			)}
		</IconWithTooltipContainer>
	);
};

const IconWithTooltipContainer = styled.div`
	cursor: pointer;
	display: inline-block;
`;
