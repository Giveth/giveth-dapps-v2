import styled from 'styled-components';

interface IRowProps {
	wrap?: number;
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

export const Row = styled.div<IRowProps>`
	display: flex;
	flex-direction: ${props =>
		props.flexDirection ? props.flexDirection : 'initial'};
	flex-wrap: ${props => (props.wrap ? 'wrap' : 'nowrap')};
	align-items: ${props => (props.alignItems ? props.alignItems : 'initial')};
	justify-content: ${props =>
		props.justifyContent ? props.justifyContent : 'initial'};
	gap: ${props => props.gap};
`;

export const Container = styled.div`
	width: 100%;
	margin: 0 auto;
	@media (min-width: 576px) {
		width: 540px;
	}
	@media (min-width: 768px) {
		width: 720px;
	}
	@media (min-width: 992px) {
		width: 960px;
	}
	@media (min-width: 1200px) {
		width: 1140px;
	}
	@media (min-width: 1400px) {
		width: 1320px;
	}
`;
