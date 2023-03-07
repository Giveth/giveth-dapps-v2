import styled from 'styled-components';

const gutters = {
	xs: '4px',
	sm: '8px',
	md: '8px',
	lg: '12px',
	xl: '12px',
};

const margins = {
	xs: '32px',
	sm: '32px',
	md: '40px',
	lg: '32px',
	xl: '32px',
};

const minWidth = {
	sm: 768,
	md: 1024,
	lg: 1280,
	xl: 1440,
};

const width = {
	sm: 704,
	md: 944,
	lg: 1218,
	xl: 1320,
};

export const Container = styled.div`
	width: 100%;
	margin-right: auto;
	margin-left: auto;
	padding-left: ${margins.xs};
	padding-right: ${margins.xs};
	@media (min-width: ${minWidth.sm}px) {
		width: ${width.sm}px;
		padding-left: ${margins.sm};
		padding-right: ${margins.sm};
	}
	@media (min-width: ${minWidth.md}px) {
		width: ${width.md}px;
		padding-left: ${margins.md};
		padding-right: ${margins.md};
	}
	@media (min-width: ${minWidth.lg}px) {
		width: ${width.lg}px;
		padding-left: ${margins.lg};
		padding-right: ${margins.lg};
	}
	@media (min-width: ${minWidth.xl}px) {
		width: ${width.xl}px;
		padding-left: ${margins.xl};
		padding-right: ${margins.xl};
	}
`;

export const OneSideContainer = styled.div`
	@media (min-width: ${minWidth.sm}px) {
		width: calc(50vw + ${width.sm / 2}px);
		margin-left: calc(50vw - ${width.sm / 2}px);
	}
	@media (min-width: ${minWidth.md}px) {
		width: calc(50vw + ${width.md / 2}px);
		margin-left: calc(50vw - ${width.md / 2}px);
	}
	@media (min-width: ${minWidth.lg}px) {
		width: calc(50vw + ${width.lg / 2}px);
		margin-left: calc(50vw - ${width.lg / 2}px);
	}
	@media (min-width: ${minWidth.xl}px) {
		width: calc(50vw + ${width.xl / 2}px);
		margin-left: calc(50vw - ${width.xl / 2}px);
	}
`;

export const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-top: 0;
	margin-right: -${gutters.xs};
	margin-left: -${gutters.xs};
	> * {
		box-sizing: border-box;
		flex-shrink: 0;
		width: 100%;
		max-width: 100%;
		padding-right: ${gutters.xs};
		padding-left: ${gutters.xs};
		margin-top: ${gutters.xs};
	}
	@media (min-width: ${minWidth.sm}px) {
		margin-right: -${gutters.sm};
		margin-left: -${gutters.sm};
		> * {
			padding-right: ${gutters.sm};
			padding-left: ${gutters.sm};
			margin-top: ${gutters.sm};
		}
	}
	@media (min-width: ${minWidth.md}px) {
		margin-right: -${gutters.md};
		margin-left: -${gutters.md};
		> * {
			padding-right: ${gutters.md};
			padding-left: ${gutters.md};
			margin-top: ${gutters.md};
		}
	}
	@media (min-width: ${minWidth.lg}px) {
		margin-right: -${gutters.lg};
		margin-left: -${gutters.lg};
		> * {
			padding-right: ${gutters.lg};
			padding-left: ${gutters.lg};
			margin-top: ${gutters.lg};
		}
	}
	@media (min-width: ${minWidth.xl}px) {
		margin-right: -${gutters.xl};
		margin-left: -${gutters.xl};
		> * {
			padding-right: ${gutters.xl};
			padding-left: ${gutters.xl};
			margin-top: ${gutters.xl};
		}
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
