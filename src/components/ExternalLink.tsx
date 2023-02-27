import { GLink } from '@giveth/ui-design-system';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

const ExternalLink = (props: {
	href: string;
	children?: ReactElement[] | ReactElement;
	title?: string | ReactElement;
	color?: string;
}) => {
	const { children, href, title, color } = props;
	return (
		<StyledLink href={href} rel='noopener noreferrer' target='_blank'>
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
`;
const StyledLink = styled.a`
	display: inline-block;
`;

export default ExternalLink;
