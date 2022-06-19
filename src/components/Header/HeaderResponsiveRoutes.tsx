import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { brandColors, IconX, neutralColors, P } from '@giveth/ui-design-system';

import { headerRoutes } from './HeaderRoutes';
import { Shadow } from '../styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import HeaderRoutesItem from './HeaderRouteItem';
import MenuPurple from '/public/images/drawer_menu_purple.svg';
import MenuWhite from '/public/images/drawer_menu_white.svg';
import { FlexCenter } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.sclie';

const HeaderRoutesResponsive = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	const activeIndex = headerRoutes.findIndex(i => router.pathname === i.href);
	const activeMenu = headerRoutes[activeIndex]?.title;
	const isDark = theme === ETheme.Dark;

	useEffect(() => {
		isOpen && setIsOpen(!isOpen);
	}, [router.pathname]);

	return (
		<>
			<DrawerClosed onClick={() => setIsOpen(true)} isDark={isDark}>
				<Image
					src={isDark ? MenuWhite : MenuPurple}
					alt={'drawer menu'}
				/>
				{activeMenu && <P>{activeMenu}</P>}
			</DrawerClosed>
			{isOpen && (
				<Modal>
					<DrawerOpened isDark={isDark}>
						<Image
							src={isDark ? MenuWhite : MenuPurple}
							alt={'drawer menu'}
						/>
						<HeaderItems>
							{headerRoutes.map(i => (
								<HeaderRoutesItem
									key={i.title}
									href={i.href}
									title={i.title}
								/>
							))}
						</HeaderItems>
					</DrawerOpened>
					<CloseButton
						isDark={isDark}
						onClick={() => setIsOpen(false)}
					>
						<IconX
							size={24}
							color={isDark ? 'white' : brandColors.giv[900]}
						/>
					</CloseButton>
					<ModalSurrounding onClick={() => setIsOpen(false)} />
				</Modal>
			)}
		</>
	);
};

const ModalSurrounding = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: ${neutralColors.gray[800]};
	opacity: 0.7;
	z-index: -1;
`;

const CloseButton = styled(FlexCenter)<{ isDark: boolean }>`
	top: 16px;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	right: 16px;
	cursor: pointer;
	margin-top: 12px;
	background: ${props => (props.isDark ? brandColors.giv[900] : 'white')};
`;

const Modal = styled.div`
	display: flex;
	gap: 8px;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
`;

const DrawerClosed = styled(FlexCenter)<{ isDark: boolean }>`
	gap: 11px;
	border-radius: 72px;
	box-shadow: ${Shadow.Dark[500]};
	background: white;
	padding: 0 14px;
	height: 48px;
	cursor: pointer;
	color: ${props => (props.isDark ? 'white' : brandColors.deep[500])};
	background: ${props => props.isDark && brandColors.giv[900]};
	display: flex;
	${mediaQueries.laptopL} {
		display: none;
	}
`;

const DrawerOpened = styled.div<{ isDark: boolean }>`
	width: 209px;
	height: fit-content;
	display: flex;
	align-items: flex-start;
	gap: 11px;
	background: ${props => (props.isDark ? brandColors.giv[900] : 'white')};
	color: ${props => (props.isDark ? 'white' : brandColors.deep[500])};
	padding: 16px;
	margin-top: 12px;
	margin-left: 29px;
	border-radius: 18px;
	box-shadow: ${Shadow.Dark[500]};
`;

const HeaderItems = styled.div`
	display: flex;
	gap: 24px;
	flex-direction: column;
`;

export default HeaderRoutesResponsive;
