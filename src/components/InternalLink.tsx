import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const InternalLink = (props: {
	href: string;
	title?: string;
	children?: ReactElement[] | ReactElement;
	color?: string;
	disabled?: boolean;
}) => {
	const { href, title, children, color, disabled } = props;
	if (disabled) return <span>{title || children}</span>;
	return (
		<Link href={href} passHref>
			<Styled color={color}>{title || children}</Styled>
		</Link>
	);
};

const Styled = styled.a`
	color: ${props => props.color || 'inherit'};
`;

export default InternalLink;
