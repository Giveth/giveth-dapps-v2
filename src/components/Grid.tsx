import styled from 'styled-components';

const bsGutterX = '1.5rem';
const bsGutterY = '0';

const minWidth = {
	sm: 768,
	md: 1024,
	lg: 1280,
	xl: 1440,
};

export const Container = styled.div`
	width: 100%;
	margin-right: auto;
	margin-left: auto;
	padding-left: ${bsGutterX};
	padding-right: ${bsGutterX};
	@media (min-width: ${minWidth.sm}px) {
		width: 704px;
	}
	@media (min-width: ${minWidth.md}px) {
		width: 944px;
	}
	@media (min-width: ${minWidth.lg}px) {
		width: 1218px;
	}
	@media (min-width: ${minWidth.xl}px) {
		width: 1320px;
	}
`;

export const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-top: 0;
	margin-right: calc(${bsGutterX} * -0.5);
	margin-left: calc(${bsGutterX} * -0.5);
	> * {
		box-sizing: border-box;
		flex-shrink: 0;
		width: 100%;
		max-width: 100%;
		padding-right: calc(${bsGutterX} * 0.5);
		padding-left: calc(${bsGutterX} * 0.5);
		margin-top: ${bsGutterY};
	}
`;

const calculateWidth = (w: any) => {
	if (typeof w === 'number') {
		return `width: ${(100 * w) / 12}%`;
	} else if (w === 'auto') {
		return 'width: auto';
	}
	return '';
};

interface ICol {
	xs?: number | 'auto';
	sm?: number | 'auto';
	md?: number | 'auto';
	lg?: number | 'auto';
	xl?: number | 'auto';
}

export const Col = styled.div<ICol>`
	flex: 0 0 auto;
	${props => calculateWidth(props.xs)};
	@media (min-width: ${minWidth.sm}px) {
		${props => calculateWidth(props.sm)};
	}
	@media (min-width: ${minWidth.md}px) {
		${props => calculateWidth(props.md)};
	}
	@media (min-width: ${minWidth.lg}px) {
		${props => calculateWidth(props.lg)};
	}
	@media (min-width: ${minWidth.xl}px) {
		${props => calculateWidth(props.xl)};
	}
`;
