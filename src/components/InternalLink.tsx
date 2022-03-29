import React, { ReactElement } from 'react';
import Link from 'next/link';

const InternalLink = (props: {
	href: string;
	title?: string;
	children?: ReactElement[] | ReactElement;
}) => {
	const { href, title, children } = props;
	return (
		<Link href={href}>
			<a>{title || children}</a>
		</Link>
	);
};

export default InternalLink;
