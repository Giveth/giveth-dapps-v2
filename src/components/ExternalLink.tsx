import React, { ReactElement } from 'react';
import styled from 'styled-components';

const ExternalLink = (props: {
	children?: ReactElement[] | ReactElement;
	href: string;
	title?: string;
	color?: string;
}) => {
	const { children, href, title, color } = props;
	return (
		<Styled
			color={color}
			href={href}
			rel='noopener noreferrer'
			target='_blank'
		>
			{title || children}
		</Styled>
	);
};

const Styled = styled.a`
	color: ${props => props.color || 'inherit'};
`;

export default ExternalLink;
