import styled from 'styled-components';

interface IFlexProps {
	flexWrap?: boolean;
	alignItems?: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline';
	justifyContent?:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'space-between'
		| 'space-around'
		| 'space-evenly';
	flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	gap?: string;
}

export const Flex = styled.div<IFlexProps>`
	display: flex;
	flex-direction: ${props =>
		props.flexDirection ? props.flexDirection : 'initial'};
	flex-wrap: ${props => (props.flexWrap ? 'wrap' : 'nowrap')};
	align-items: ${props => (props.alignItems ? props.alignItems : 'initial')};
	justify-content: ${props =>
		props.justifyContent ? props.justifyContent : 'initial'};
	gap: ${props => props.gap};
`;

interface IFlexCenter {
	gap?: string;
	direction?: 'row' | 'column';
}

export const FlexCenter = styled.div<IFlexCenter>`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: ${props => props.gap};
	flex-direction: ${props => props.direction};
`;

export const FlexSpacer = styled.div`
	flex: 1;
`;
