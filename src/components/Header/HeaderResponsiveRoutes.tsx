import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { headerRoutes } from './HeaderRoutes';
import { Shadow } from '../styled-components/Shadow';
import { P, brandColors } from '@giveth/ui-design-system';
import { mediaQueries } from '@/utils/constants';
import HeaderRoutesItem from './HeaderRouteItem';
import { ETheme, useGeneral } from '@/context/general.context';

interface IDrawer {
	isOpen?: boolean;
}

const HeaderRoutesResponsive = () => {
	const router = useRouter();
	const activeIndex = headerRoutes.findIndex(i => router.pathname === i.href);
	const activeMenu = headerRoutes[activeIndex]?.title;
	const [isOpen, setIsOpen] = useState(false);
	const { theme } = useGeneral();

	useEffect(() => {
		isOpen && setIsOpen(!isOpen);
	}, [activeIndex]);
	return (
		<Wrapper
			onMouseEnter={() => setIsOpen(true)}
			onClick={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<DrawerClosed isOpen={isOpen}>
				<Image
					src={'/images/drawer_menu_purple.svg'}
					alt={'drawer menu'}
				/>
				<P>{activeMenu}</P>
			</DrawerClosed>

			<DrawerOpened isOpen={isOpen}>
				<Image
					src={'/images/drawer_menu_purple.svg'}
					alt={'drawer menu'}
				/>
				<HeaderItems>
					{headerRoutes.map((i, index) => {
						return (
							<HeaderRoutesItem
								key={i.title}
								href={i.href}
								title={i.title}
								active={activeIndex === index}
								theme={theme}
							/>
						);
					})}
				</HeaderItems>
			</DrawerOpened>
		</Wrapper>
	);
};

const Image = styled.img``;

const DrawerClosed = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 11px;
	border-radius: 72px;
	box-shadow: ${(props: IDrawer) =>
		props.isOpen ? 'none' : Shadow.Dark['500']};
	background: white;
	padding: 0 14px;
	height: 48px;
	cursor: pointer;
	z-index: ${(props: IDrawer) => (props.isOpen ? '0' : '1080')};
	color: ${brandColors.deep[500]};
`;

const DrawerOpened = styled.div`
	position: absolute;
	top: 10px;
	width: 190px;
	align-items: flex-start;
	background: white;
	display: ${(props: IDrawer) => (props.isOpen ? 'flex' : 'none')};
	flex-direction: row;
	padding: 15px 20px 20px 20px;
	border-radius: 18px;
	box-shadow: ${Shadow.Dark['500']};
	transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
	visibility: ${(props: IDrawer) => (props.isOpen ? 'visible' : 'hidden')};
	opacity: ${(props: IDrawer) => (props.isOpen ? 1 : 0)};
	z-index: ${(props: IDrawer) => (props.isOpen ? '1080' : '0')};
	> * {
		opacity: ${props => (props.isOpen ? 1 : 0)};
		transition: opacity 0.25s ease-in;
		transition-delay: 0.25s;
	}
	${mediaQueries.mobileL} {
		padding: 15px 20px 10px 20px;
		img {
			padding: 5px 0 0 0;
		}
	}
`;
const HeaderItems = styled.div`
	display: flex;
	flex-direction: column;
`;

const Wrapper = styled.div`
	position: relative;
	display: none;

	${mediaQueries.mobileS} {
		display: flex;
	}
	${mediaQueries.laptopL} {
		display: none;
	}
`;

export default HeaderRoutesResponsive;
