import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';

const Divider = ({ color, height }: { color?: string; height?: string }) => {
	return <Separator height={height} color={color} />;
};

const Separator = styled.div<{ color?: string; height?: string }>`
	width: 100%;
	height: ${props => props.height || '1px'};
	background-color: ${props => props.color || neutralColors.gray['400']};
`;

export default Divider;
