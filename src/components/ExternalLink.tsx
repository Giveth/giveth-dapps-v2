import { semanticColors } from '@giveth/ui-design-system';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

const ExternalLink = (props: {
	children?: ReactElement;
	href: string;
	title?: string;
}) => {
	const { children, href, title } = props;
	return (
		<StyledLink href={href} rel='noopener noreferrer' target='_blank'>
			{title || children}
		</StyledLink>
	);
};

const StyledLink = styled.a`
	color: ${semanticColors.blueSky[500]} !important;
`;

export default ExternalLink;
