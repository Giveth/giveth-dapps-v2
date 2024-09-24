import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { ITooltipDirection, Tooltip } from './Tooltip';
import type { FC, ReactNode } from 'react';

interface IIconWithTooltipProps extends ITooltipDirection {
	icon: ReactNode;
	children: ReactNode;
	delay?: boolean;
}

export const IconWithTooltip: FC<IIconWithTooltipProps> = ({
	icon,
	direction,
	align = 'center',
	children,
	delay = false,
}) => {
	const [show, setShow] = useState(false);
	const elRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const showTooltip = () => {
		if (delay) {
			timeoutRef.current = setTimeout(() => {
				setShow(true);
			}, 500); // 0.5 second delay
		} else {
			setShow(true);
		}
	};

	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setShow(false);
	};

	useEffect(() => {
		function handleRemoveTooltip() {
			hideTooltip();
		}
		window.addEventListener('scroll', handleRemoveTooltip);

		return () => {
			window.removeEventListener('scroll', handleRemoveTooltip);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<IconWithTooltipContainer
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onClick={e => {
				e.stopPropagation(); // make tooltip content clickable without affecting parent
			}}
			ref={elRef}
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
