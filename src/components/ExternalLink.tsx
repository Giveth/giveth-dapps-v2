import React, { ReactElement } from 'react';

const ExternalLink = (props: {
	children?: ReactElement[] | ReactElement;
	href: string;
	title?: string;
}) => {
	const { children, href, title } = props;
	return (
		<a href={href} rel='noopener noreferrer' target='_blank'>
			{title || children}
		</a>
	);
};

export default ExternalLink;
