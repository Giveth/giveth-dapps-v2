import { GLink } from '@giveth/ui-design-system';
import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

const ExternalLink = (props: {
	href: string;
	children?: ReactNode;
	title?: string | ReactElement;
	color?: string;
	fullWidth?: boolean;
	className?: string;
}) => {
	const { children, href, title, color, fullWidth, className } = props;
	return (
		<StyledLink
			className={className}
			fullWidth={fullWidth}
			href={href}
			rel='noopener noreferrer'
			target='_blank'
		>
			{title ? (
				<StyledGLink color={color}>{title}</StyledGLink>
			) : (
				children
			)}
		</StyledLink>
	);
};

const StyledGLink = styled(GLink)`
	color: ${props => props.color || 'inherit'};
	font-size: inherit;
`;
const StyledLink = styled.a<{ fullWidth?: boolean }>`
	display: ${props => (props.fullWidth ? 'block' : 'inline-block')};
`;

export default ExternalLink;
