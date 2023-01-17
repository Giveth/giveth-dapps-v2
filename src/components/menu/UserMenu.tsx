import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MenuContainer } from './Menu.sc';
import { useAppSelector } from '@/features/hooks';
import { UserItems } from './UserItems';

export const UserMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { isSignedIn } = useAppSelector(state => state.user);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<UserMenuContainer theme={theme} isSignedIn={isSignedIn || false}>
			<UserItems />
		</UserMenuContainer>
	);
};

interface IUserMenuContainer {
	isSignedIn: boolean;
}

const UserMenuContainer = styled(MenuContainer)<IUserMenuContainer>``;
