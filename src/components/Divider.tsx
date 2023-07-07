import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';

const Divider = ({ color }: { color?: string }) => {
	return <Line color={color} />;
};

const Line = styled.div<{ color?: string }>`
	width: 100%;
	height: 1px;
	background-color: ${props => props.color || neutralColors.gray['400']};
`;

export default Divider;
