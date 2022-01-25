import { ETheme } from '@/context/general.context';
import { brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '../styled-components/Shadow';

interface isMounted {
	isMounted: boolean;
	theme?: ETheme;
}

export const MenuContainer = styled.div<isMounted>`
	position: absolute;
	top: 40%;
	right: 0;
	width: 260px;
	/* background-color: ${brandColors.giv[900]};
	border: 1px solid ${brandColors.giv[600]}; */
	background-color: ${props =>
		props.theme === ETheme.Dark ? brandColors.giv[900] : 'white'};
	border: 1px solid
		${props =>
			props.theme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	border-radius: 10px 0 10px 10px;
	padding: ${props => (props.isMounted ? '38px 12px 12px' : '12px')};
	z-index: 0;
	height: ${props => (props.isMounted ? '70vh' : '0px')};
	overflow: hidden;
	transition: height 0.3s ease, padding 0.3s ease;
	box-shadow: ${props =>
		props.theme === ETheme.Dark ? '' : Shadow.Dark[500]};
`;
