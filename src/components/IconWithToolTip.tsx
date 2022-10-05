import styled from 'styled-components';
import { useRef, useState } from 'react';
import { ITooltipDirection, Tooltip } from './Tooltip';
import type { FC, ReactNode } from 'react';

interface IIconWithTooltipProps extends ITooltipDirection {
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
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
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
`;
