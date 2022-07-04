import React, { FC } from 'react';
import {
	neutralColors,
	semanticColors,
	B,
	GLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IInputBox {
	value?: number;
	onChange: (e: number) => void;
	placeholder?: string;
	type?: string;
	errorHandler: {
		condition: (i: number) => boolean;
		message: string;
	};
	setError?: any;
	error?: any;
	onFocus?: any;
	disabled?: boolean;
}

const InputBox: FC<IInputBox> = ({
	value,
	onChange,
	error,
	setError,
	errorHandler,
	type,
	placeholder,
	onFocus,
	disabled,
}) => {
	return (
		<Box>
			<Wrapper>
				<Input
					id='input-box'
					value={value}
					type={type}
					onChange={e => {
						const num = Number(e.target.value);
						onChange(num);
						setError(errorHandler.condition(num));
					}}
					onFocus={() => onFocus(true)}
					onBlur={() => onFocus(false)}
					placeholder={placeholder}
					disabled={disabled}
				/>
			</Wrapper>
			{error && <ErrorMsg>{errorHandler?.message}</ErrorMsg>}
		</Box>
	);
};

const Box = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const Input = styled.input`
	border-width: 0;
	height: 100%;
	font-size: 16px;
	font-weight: inherit;
	background: inherit;
	font-family: inherit;
	&:focus {
		outline: none;
	}

	&::placeholder {
		color: ${neutralColors.gray[500]};
		font-size: 16px;
	}
`;

const Wrapper = styled(B)`
	padding: 5px 16px;
	margin: 0 auto;
	height: 54px;
	* {
		width: 90%;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
`;

const ErrorMsg = styled(GLink)`
	position: absolute;
	margin-top: 58px;
	color: ${semanticColors.punch[500]};
`;

export default InputBox;
