import { brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface isMounted {
	isMounted: boolean;
}

export const RewardMenuContainer = styled.div<isMounted>`
	position: absolute;
	top: 40%;
	right: 0;
	width: 260px;
	background-color: ${brandColors.giv[900]};
	border: 1px solid ${brandColors.giv[600]};
	border-radius: 10px 0 10px 10px;
	padding: ${props => (props.isMounted ? '38px 12px' : '12px')};
	z-index: 0;
	height: ${props => (props.isMounted ? '400px' : '0px')};
	overflow: hidden;
	transition: height 0.3s ease, padding 0.3s ease;
`;
