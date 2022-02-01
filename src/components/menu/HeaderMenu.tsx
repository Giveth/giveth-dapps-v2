import { useGeneral } from '@/context/general.context';
import { GLink } from '@giveth/ui-design-system';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MenuContainer } from './Menu.sc';

export const HeaderSmallMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { theme } = useGeneral();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<>
			<HeaderSmallMenuContainer isMounted={isMounted} theme={theme}>
				<GLink size='Big'>Home</GLink>
				<GLink size='Big'>Home</GLink>
				<GLink size='Big'>Home</GLink>
			</HeaderSmallMenuContainer>
		</>
	);
};

const HeaderSmallMenuContainer = styled(MenuContainer)`
	max-height: 380px;
	left: 0;
	right: unset;
	border-radius: 0 10px 10px 10px;
`;
