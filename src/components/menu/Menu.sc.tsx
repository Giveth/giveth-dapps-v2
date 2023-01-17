import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Shadow } from '../styled-components/Shadow';

interface isMounted {
	isMounted: boolean;
	theme?: ETheme;
}

export const MenuContainer = styled.div<isMounted>`
	position: absolute;
	top: 40%;
	right: 0;
	width: 276px;
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
	border: 1px solid
		${props =>
			props.theme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	border-radius: 10px 0 10px 10px;
	padding: ${props => (props.isMounted ? '38px 16px 16px' : '16px')};
	z-index: 0;
	height: ${props => (props.isMounted ? '70vh' : '0px')};
	transition: height 0.3s ease, padding 0.3s ease;
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
	overflow-y: overlay;
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
`;
