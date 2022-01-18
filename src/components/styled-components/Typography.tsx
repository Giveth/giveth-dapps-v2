import styled from 'styled-components';

interface ITypographyProps {
	size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
	wight?: 'bold' | 'normal';
	color?: string;
}

export const H1 = styled.h1`
	font-family: 'TeX Gyre Adventor';
	font-size: 120px;
	font-style: normal;
	font-weight: 700;
	line-height: 132px;
	letter-spacing: -0.02em;
	text-align: left;
	color: #ffffff;
	margin: 0;
	color: inherit;
`;

export const H2 = styled.h2`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: bold;
	font-size: 64px;
	line-height: 120%;
	color: #ffffff;
	margin: 0;
	color: inherit;
`;

export const H3 = styled.h3`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: bold;
	font-size: 44px;
	line-height: 120%;
	color: #ffffff;
	margin: 0;
	color: inherit;
`;

export const H4 = styled.h3`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: bold;
	font-size: 24px;
	line-height: 120%;
	color: #ffffff;
	margin: 0;
	color: inherit;
`;

export const P = styled.p<ITypographyProps>`
	font-family: 'Red Hat Text';
	font-weight: normal;
	font-size: ${props => {
		switch (props.size) {
			case 'xlarge':
				return '42px';
			case 'large':
				return '32px';
			case 'medium':
				return '28px';
			case 'small':
				return '24px';
			case 'xsmall':
				return '20px';
			default:
				return 'inherit';
		}
	}};
	line-height: ${props => {
		switch (props.size) {
			case 'xlarge':
				return '60px';
			case 'large':
				return '42px';
			case 'medium':
				return '38px';
			case 'small':
				return '32px';
			case 'xsmall':
				return '24px';
			default:
				return 'inherit';
		}
	}};
	margin: 0;
	color: ${props => props.color || 'inherit'};
`;
