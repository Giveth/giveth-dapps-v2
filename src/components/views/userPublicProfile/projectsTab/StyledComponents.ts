import styled from 'styled-components';

interface IBadge {
	mainColor?: any;
}

export const Badge = styled.span<IBadge>`
	display: flex;
	align-items: center;
	font-size: 12px;
	color: ${props => props.mainColor![700]} !important;
	background: ${props => props.mainColor![100]};
	border: 2px solid ${props => props.mainColor![300]};
	box-sizing: border-box;
	border-radius: 50px;
	padding: 2px 8px;
	height: 24px;
`;
