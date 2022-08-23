import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { MenuContainer } from '../menu/Menu.sc';

const NotificationMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<NotifsMenuContainer isMounted={isMounted} theme={theme}>
			<div>Hello</div>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
			<h6>Hello</h6>
		</NotifsMenuContainer>
	);
};

export default NotificationMenu;

const NotifsMenuContainer = styled(MenuContainer)`
	max-height: 470px;
`;
