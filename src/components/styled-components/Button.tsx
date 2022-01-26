import styled from 'styled-components';

interface IButtonProps {
	secondary?: boolean;
	neutral?: boolean;
	outline?: boolean;
}

export const Button = styled.button<IButtonProps>`
	background: ${props => {
		if (props.outline) {
			return 'unset';
		}
		return props.neutral
			? '#F7F7F9'
			: props.secondary
			? '#E1458D'
			: '#5326EC';
	}};
	height: 64px;
	border-width: 2px;
	border-style: solid;
	border-color: ${props => {
		if (props.secondary) {
			return '#E1458D';
		}
		if (props.neutral) {
			return '#ffffff';
		}
		return '#5326EC';
	}};
	border-radius: 88px;
	color: ${props => {
		if (props.outline) {
			if (props.secondary) {
				return '#E1458D';
			}
			if (props.neutral) {
				return '#ffffff';
			}
			return '#5326EC';
		}
		return props.neutral ? '#092560' : '#ffffff';
	}};
	width: 100%;
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 18px;
	text-align: center;
	cursor: pointer;
	display: block;
`;
