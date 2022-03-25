import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { brandColors } from '@giveth/ui-design-system';

import Routes from '@/lib/constants/Routes';

interface IHeaderRouteItem {
	href: string;
	title?: string;
}

const HeaderRoutesItem = ({ href, title }: IHeaderRouteItem) => (
	<Link href={href} passHref>
		<RoutesItem isCreate={href === Routes.CreateProject} href={href}>
			{title}
		</RoutesItem>
	</Link>
);

const RoutesItem = styled.a<{ isCreate: boolean }>`
	font-weight: 400;
	font-size: 16px;
	cursor: pointer;
	border-radius: 72px;
	color: ${props => (props.isCreate ? brandColors.pinky[500] : 'inherit')};

	:hover {
		color: ${brandColors.pinky[500]} !important;
	}
`;

export default HeaderRoutesItem;
