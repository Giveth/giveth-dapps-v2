import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { GLink } from '@giveth/ui-design-system';

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
		<Link href={href}>
			<Styled color={color}>{title || children}</Styled>
		</Link>
	);
};

const Styled = styled(GLink)`
	color: ${props => props.color || 'inherit'};
	font-size: inherit;
`;

export default InternalLink;
