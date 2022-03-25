import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { brandColors } from '@giveth/ui-design-system';
import { mediaQueries } from '@/utils/constants';

interface IHeaderRouteItem {
	href: string;
	title?: string;
	active?: boolean;
	theme?: any;
}

const HeaderRoutesItem = ({ href, title, active, theme }: IHeaderRouteItem) => (
	<Link href={href} passHref>
		<RoutesItem
			href={href}
			className={active ? 'active' : ''}
			theme={theme}
			active={active}
		>
			{title}
		</RoutesItem>
	</Link>
);

const RoutesItem = styled.a`
	padding: 7px 15px;
	font-weight: 400;
	font-size: 14px;
	cursor: pointer;
	border-radius: 72px;
	color: ${(props: IHeaderRouteItem) =>
		props.active ? brandColors.pinky[500] : brandColors.deep[500]};
	:hover {
		color: ${brandColors.pinky[500]} !important;
	}
	&.active {
		background: gray;
		:hover {
			color: ${brandColors.deep[800]} !important;
		}
	}
	${mediaQueries.mobileS} {
		&.active {
			background: transparent;
		}
		padding: 2px 0 15px 15px;
	}
`;

export default HeaderRoutesItem;
